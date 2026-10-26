package com.shopsphere.controller;

import com.shopsphere.dto.request.ReviewRequest;
import com.shopsphere.dto.response.ReviewResponse;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<ReviewResponse>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getReviewsForProduct(productId, page, size));
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.addOrUpdateReview(principal.getId(), request));
    }
}
