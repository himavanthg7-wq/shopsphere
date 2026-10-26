package com.shopsphere.controller;

import com.shopsphere.dto.response.WishlistResponse;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<WishlistResponse> getWishlist(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(wishlistService.getWishlistResponse(principal.getId()));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<WishlistResponse> addToWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(principal.getId(), productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<WishlistResponse> removeFromWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.removeFromWishlist(principal.getId(), productId));
    }

    @PostMapping("/{productId}/move-to-cart")
    public ResponseEntity<WishlistResponse> moveToCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.moveToCart(principal.getId(), productId));
    }
}
