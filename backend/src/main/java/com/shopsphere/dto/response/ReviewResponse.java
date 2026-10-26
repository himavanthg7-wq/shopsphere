package com.shopsphere.dto.response;

import com.shopsphere.entity.Review;

import java.time.LocalDateTime;

public class ReviewResponse {

    private Long id;
    private Long productId;
    private String productName;
    private Long userId;
    private String userName;
    private Integer rating;
    private String comment;
    private Boolean isVerifiedPurchase;
    private LocalDateTime createdAt;

    public ReviewResponse() {}

    public static ReviewResponse fromEntity(Review r) {
        ReviewResponse res = new ReviewResponse();
        res.setId(r.getId());
        if (r.getProduct() != null) {
            res.setProductId(r.getProduct().getId());
            res.setProductName(r.getProduct().getName());
        }
        if (r.getUser() != null) {
            res.setUserId(r.getUser().getId());
            res.setUserName(r.getUser().getFirstName() + " " + r.getUser().getLastName());
        }
        res.setRating(r.getRating());
        res.setComment(r.getComment());
        res.setIsVerifiedPurchase(r.getIsVerifiedPurchase());
        res.setCreatedAt(r.getCreatedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Boolean getIsVerifiedPurchase() { return isVerifiedPurchase; }
    public void setIsVerifiedPurchase(Boolean isVerifiedPurchase) { this.isVerifiedPurchase = isVerifiedPurchase; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
