package com.shopsphere.service;

import com.shopsphere.dto.request.ReviewRequest;
import com.shopsphere.dto.response.ReviewResponse;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository,
                         OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public Page<ReviewResponse> getReviewsForProduct(Long productId, int page, int size) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, PageRequest.of(page, size))
                .map(ReviewResponse::fromEntity);
    }

    @Transactional
    public ReviewResponse addOrUpdateReview(Long userId, ReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        // Crucial Business Logic: Verify user has purchased and received this product
        boolean isDeliveredPurchase = orderRepository.hasPurchasedAndDeliveredProduct(userId, product.getId(), OrderStatus.DELIVERED);
        if (!isDeliveredPurchase) {
            throw new BadRequestException("Verification Failed: You can only review products that have been delivered to your address.");
        }

        Review review = reviewRepository.findByUserIdAndProductId(userId, product.getId())
                .orElseGet(() -> new Review(user, product, request.getRating(), request.getComment(), true));

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setIsVerifiedPurchase(true);

        Review saved = reviewRepository.save(review);

        // Recalculate average rating and count
        BigDecimal avg = reviewRepository.calculateAverageRating(product.getId());
        long count = reviewRepository.countByProductId(product.getId());
        product.setRatingAvg(avg != null ? avg.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
        product.setRatingCount((int) count);
        productRepository.save(product);

        return ReviewResponse.fromEntity(saved);
    }
}
