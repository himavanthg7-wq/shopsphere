package com.shopsphere.service;

import com.shopsphere.dto.request.AddToCartRequest;
import com.shopsphere.dto.request.UpdateCartItemRequest;
import com.shopsphere.dto.response.CartItemResponse;
import com.shopsphere.dto.response.CartResponse;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CouponService couponService;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository,
                       CouponService couponService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.couponService = couponService;
    }

    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
            Cart cart = new Cart(user);
            return cartRepository.save(cart);
        });
    }

    @Transactional(readOnly = true)
    public CartResponse getCartResponse(Long userId, String couponCode) {
        Cart cart = getOrCreateCart(userId);
        CartResponse response = new CartResponse();
        response.setCartId(cart.getId());

        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(CartItemResponse::fromEntity)
                .collect(Collectors.toList());
        response.setItems(itemResponses);

        int totalCount = itemResponses.stream().mapToInt(CartItemResponse::getQuantity).sum();
        response.setTotalItems(totalCount);

        BigDecimal subtotal = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        response.setSubtotal(subtotal);

        // Calculate coupon discount
        BigDecimal discount = BigDecimal.ZERO;
        if (couponCode != null && !couponCode.trim().isEmpty() && subtotal.compareTo(BigDecimal.ZERO) > 0) {
            try {
                discount = couponService.validateAndCalculateDiscount(couponCode.trim(), subtotal, userId);
                response.setAppliedCoupon(couponCode.trim().toUpperCase());
            } catch (Exception e) {
                // If coupon invalid, discount remains zero
            }
        }
        response.setDiscountAmount(discount);

        // Tax calculation: 18% standard GST on (subtotal - discount)
        BigDecimal taxable = subtotal.subtract(discount).max(BigDecimal.ZERO);
        BigDecimal tax = taxable.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
        response.setTaxAmount(tax);

        // Shipping calculation: Free over ₹999, else ₹50
        BigDecimal shipping = BigDecimal.ZERO;
        if (subtotal.compareTo(BigDecimal.ZERO) > 0 && subtotal.compareTo(new BigDecimal("999.00")) < 0) {
            shipping = new BigDecimal("50.00");
        }
        response.setShippingAmount(shipping);

        // Total
        BigDecimal total = taxable.add(tax).add(shipping).setScale(2, RoundingMode.HALF_UP);
        response.setTotalAmount(total);

        return response;
    }

    @Transactional
    public CartResponse addToCart(Long userId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        int available = (product.getInventory() != null) ? product.getInventory().getQuantity() : 0;
        if (available <= 0) {
            throw new BadRequestException("Product is currently out of stock.");
        }

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElseGet(() -> new CartItem(cart, product, 0));

        int newQty = item.getQuantity() + request.getQuantity();
        if (newQty > available) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + available + ").");
        }

        item.setQuantity(newQty);
        cartItemRepository.save(item);

        return getCartResponse(userId, null);
    }

    @Transactional
    public CartResponse updateCartItem(Long userId, Long cartItemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to user's cart.");
        }

        int available = (item.getProduct().getInventory() != null) ? item.getProduct().getInventory().getQuantity() : 0;
        if (request.getQuantity() > available) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + available + ").");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return getCartResponse(userId, null);
    }

    @Transactional
    public CartResponse removeCartItem(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to user's cart.");
        }

        cartItemRepository.delete(item);
        cart.getItems().remove(item);

        return getCartResponse(userId, null);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCartId(cart.getId());
        cart.getItems().clear();
    }
}
