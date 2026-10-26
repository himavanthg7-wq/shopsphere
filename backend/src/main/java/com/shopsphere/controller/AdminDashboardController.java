package com.shopsphere.controller;

import com.shopsphere.dto.request.CategoryRequest;
import com.shopsphere.dto.request.CouponRequest;
import com.shopsphere.dto.request.OrderStatusUpdateRequest;
import com.shopsphere.dto.request.ProductRequest;
import com.shopsphere.dto.response.DashboardStatsResponse;
import com.shopsphere.dto.response.OrderResponse;
import com.shopsphere.dto.response.ProductResponse;
import com.shopsphere.entity.*;
import com.shopsphere.repository.InventoryRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.service.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    private final AnalyticsService analyticsService;
    private final OrderService orderService;
    private final ProductService productService;
    private final CategoryService categoryService;
    private final CouponService couponService;
    private final InventoryService inventoryService;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    public AdminDashboardController(AnalyticsService analyticsService,
                                    OrderService orderService,
                                    ProductService productService,
                                    CategoryService categoryService,
                                    CouponService couponService,
                                    InventoryService inventoryService,
                                    InventoryRepository inventoryRepository,
                                    UserRepository userRepository) {
        this.analyticsService = analyticsService;
        this.orderService = orderService;
        this.productService = productService;
        this.categoryService = categoryService;
        this.couponService = couponService;
        this.inventoryService = inventoryService;
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardMetrics() {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics());
    }

    // Orders Management
    @GetMapping("/orders")
    public ResponseEntity<Page<OrderResponse>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }

    // Products Management
    @PostMapping("/products")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Categories Management
    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // Inventory Management
    @GetMapping("/inventory")
    public ResponseEntity<List<Map<String, Object>>> getInventory() {
        List<Inventory> list = inventoryRepository.findAll();
        List<Map<String, Object>> result = list.stream().map(inv -> {
            Product p = inv.getProduct();
            return Map.<String, Object>of(
                    "id", inv.getId(),
                    "productId", p != null ? p.getId() : null,
                    "productName", p != null ? p.getName() : "Unknown",
                    "sku", p != null ? p.getSku() : "N/A",
                    "quantity", inv.getQuantity(),
                    "reorderLevel", inv.getReorderLevel(),
                    "isLowStock", inv.getQuantity() <= inv.getReorderLevel(),
                    "updatedAt", inv.getUpdatedAt()
            );
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/inventory/{productId}")
    public ResponseEntity<Inventory> updateStock(
            @PathVariable Long productId,
            @RequestParam int quantity,
            @RequestParam(required = false) Integer reorderLevel) {
        return ResponseEntity.ok(inventoryService.updateStock(productId, quantity, reorderLevel));
    }

    // Coupons Management
    @GetMapping("/coupons")
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @PostMapping("/coupons")
    public ResponseEntity<Coupon> createCoupon(@Valid @RequestBody CouponRequest request) {
        return ResponseEntity.ok(couponService.createCoupon(request));
    }

    @PutMapping("/coupons/{id}")
    public ResponseEntity<Coupon> updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CouponRequest request) {
        return ResponseEntity.ok(couponService.updateCoupon(id, request));
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }

    // Customer Accounts
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = users.stream().map(u -> Map.<String, Object>of(
                "id", u.getId(),
                "firstName", u.getFirstName(),
                "lastName", u.getLastName(),
                "email", u.getEmail(),
                "phone", u.getPhone() != null ? u.getPhone() : "",
                "status", u.getStatus(),
                "roles", u.getRoles().stream().map(Role::getName).collect(Collectors.toList()),
                "createdAt", u.getCreatedAt()
        )).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}
