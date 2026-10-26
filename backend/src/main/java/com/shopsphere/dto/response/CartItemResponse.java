package com.shopsphere.dto.response;

import com.shopsphere.entity.CartItem;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.ProductImage;

import java.math.BigDecimal;

public class CartItemResponse {

    private Long itemId;
    private Long productId;
    private String productName;
    private String productSlug;
    private String productImage;
    private BigDecimal unitPrice;
    private BigDecimal discountedPrice;
    private Integer quantity;
    private BigDecimal subtotal;
    private Boolean inStock;
    private Integer availableStock;

    public CartItemResponse() {}

    public static CartItemResponse fromEntity(CartItem item) {
        Product p = item.getProduct();
        CartItemResponse res = new CartItemResponse();
        res.setItemId(item.getId());
        res.setProductId(p.getId());
        res.setProductName(p.getName());
        res.setProductSlug(p.getSlug());
        res.setUnitPrice(p.getPrice());

        BigDecimal effPrice = p.getDiscountedPrice();
        res.setDiscountedPrice(effPrice);
        res.setQuantity(item.getQuantity());
        res.setSubtotal(effPrice.multiply(BigDecimal.valueOf(item.getQuantity())));

        int stock = p.getInventory() != null ? p.getInventory().getQuantity() : 0;
        res.setAvailableStock(stock);
        res.setInStock(stock >= item.getQuantity());

        String img = p.getImages().stream()
                .filter(i -> Boolean.TRUE.equals(i.getIsPrimary()))
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(p.getImages().isEmpty() ? null : p.getImages().get(0).getImageUrl());
        res.setProductImage(img);

        return res;
    }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductSlug() { return productSlug; }
    public void setProductSlug(String productSlug) { this.productSlug = productSlug; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getDiscountedPrice() { return discountedPrice; }
    public void setDiscountedPrice(BigDecimal discountedPrice) { this.discountedPrice = discountedPrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public Integer getAvailableStock() { return availableStock; }
    public void setAvailableStock(Integer availableStock) { this.availableStock = availableStock; }
}
