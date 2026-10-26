package com.shopsphere.service;

import com.shopsphere.dto.request.AddToCartRequest;
import com.shopsphere.dto.response.ProductResponse;
import com.shopsphere.dto.response.WishlistResponse;
import com.shopsphere.entity.*;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    public WishlistService(WishlistRepository wishlistRepository,
                           WishlistItemRepository wishlistItemRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository,
                           CartService cartService) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.cartService = cartService;
    }

    public Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
            Wishlist wl = new Wishlist(user);
            return wishlistRepository.save(wl);
        });
    }

    @Transactional(readOnly = true)
    public WishlistResponse getWishlistResponse(Long userId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        List<ProductResponse> products = wishlist.getItems().stream()
                .map(item -> ProductResponse.fromEntity(item.getProduct()))
                .collect(Collectors.toList());
        return new WishlistResponse(wishlist.getId(), products);
    }

    @Transactional
    public WishlistResponse addToWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (!wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), productId)) {
            WishlistItem item = new WishlistItem(wishlist, product);
            wishlistItemRepository.save(item);
            wishlist.getItems().add(item);
        }

        return getWishlistResponse(userId);
    }

    @Transactional
    public WishlistResponse removeFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), productId)
                .ifPresent(item -> {
                    wishlistItemRepository.delete(item);
                    wishlist.getItems().remove(item);
                });
        return getWishlistResponse(userId);
    }

    @Transactional
    public WishlistResponse moveToCart(Long userId, Long productId) {
        cartService.addToCart(userId, new AddToCartRequest(productId, 1));
        return removeFromWishlist(userId, productId);
    }
}
