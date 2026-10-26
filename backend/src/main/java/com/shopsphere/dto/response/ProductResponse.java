package com.shopsphere.dto.response;

import com.shopsphere.entity.Product;
import com.shopsphere.entity.ProductImage;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class ProductResponse {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPercent;
    private BigDecimal discountedPrice;
    private String sku;
    private Long brandId;
    private String brandName;
    private String brandSlug;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private Boolean isFeatured;
    private Boolean isActive;
    private BigDecimal ratingAvg;
    private Integer ratingCount;
    private Integer stockQuantity;
    private Integer reorderLevel;
    private String primaryImageUrl;
    private List<String> imageUrls;
    private LocalDateTime createdAt;

    public ProductResponse() {}

    public static ProductResponse fromEntity(Product p) {
        ProductResponse res = new ProductResponse();
        res.setId(p.getId());
        res.setName(p.getName());
        res.setSlug(p.getSlug());
        res.setDescription(p.getDescription());
        res.setPrice(p.getPrice());
        res.setDiscountPercent(p.getDiscountPercent());
        res.setDiscountedPrice(p.getDiscountedPrice());
        res.setSku(p.getSku());

        if (p.getBrand() != null) {
            res.setBrandId(p.getBrand().getId());
            res.setBrandName(p.getBrand().getName());
            res.setBrandSlug(p.getBrand().getSlug());
        }

        if (p.getCategory() != null) {
            res.setCategoryId(p.getCategory().getId());
            res.setCategoryName(p.getCategory().getName());
            res.setCategorySlug(p.getCategory().getSlug());
        }

        res.setIsFeatured(p.getIsFeatured());
        res.setIsActive(p.getIsActive());
        res.setRatingAvg(p.getRatingAvg());
        res.setRatingCount(p.getRatingCount());

        if (p.getInventory() != null) {
            res.setStockQuantity(p.getInventory().getQuantity());
            res.setReorderLevel(p.getInventory().getReorderLevel());
        } else {
            res.setStockQuantity(0);
            res.setReorderLevel(5);
        }

        List<String> urls = p.getImages().stream().map(ProductImage::getImageUrl).collect(Collectors.toList());
        res.setImageUrls(urls);

        String primary = p.getImages().stream()
                .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(urls.isEmpty() ? null : urls.get(0));
        res.setPrimaryImageUrl(primary);

        res.setCreatedAt(p.getCreatedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(BigDecimal discountPercent) { this.discountPercent = discountPercent; }

    public BigDecimal getDiscountedPrice() { return discountedPrice; }
    public void setDiscountedPrice(BigDecimal discountedPrice) { this.discountedPrice = discountedPrice; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public Long getBrandId() { return brandId; }
    public void setBrandId(Long brandId) { this.brandId = brandId; }

    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }

    public String getBrandSlug() { return brandSlug; }
    public void setBrandSlug(String brandSlug) { this.brandSlug = brandSlug; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategorySlug() { return categorySlug; }
    public void setCategorySlug(String categorySlug) { this.categorySlug = categorySlug; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public BigDecimal getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(BigDecimal ratingAvg) { this.ratingAvg = ratingAvg; }

    public Integer getRatingCount() { return ratingCount; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Integer getReorderLevel() { return reorderLevel; }
    public void setReorderLevel(Integer reorderLevel) { this.reorderLevel = reorderLevel; }

    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public void setPrimaryImageUrl(String primaryImageUrl) { this.primaryImageUrl = primaryImageUrl; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
