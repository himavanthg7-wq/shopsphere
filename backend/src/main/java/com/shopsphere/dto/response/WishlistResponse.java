package com.shopsphere.dto.response;

import java.util.ArrayList;
import java.util.List;

public class WishlistResponse {

    private Long wishlistId;
    private List<ProductResponse> products = new ArrayList<>();
    private Integer totalItems = 0;

    public WishlistResponse() {}

    public WishlistResponse(Long wishlistId, List<ProductResponse> products) {
        this.wishlistId = wishlistId;
        this.products = products;
        this.totalItems = products != null ? products.size() : 0;
    }

    public Long getWishlistId() { return wishlistId; }
    public void setWishlistId(Long wishlistId) { this.wishlistId = wishlistId; }

    public List<ProductResponse> getProducts() { return products; }
    public void setProducts(List<ProductResponse> products) {
        this.products = products;
        this.totalItems = products != null ? products.size() : 0;
    }

    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }
}
