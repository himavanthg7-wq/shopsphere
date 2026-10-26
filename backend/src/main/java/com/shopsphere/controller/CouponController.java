package com.shopsphere.controller;

import com.shopsphere.entity.Coupon;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping("/active")
    public ResponseEntity<List<Coupon>> getActiveCoupons() {
        return ResponseEntity.ok(couponService.getActiveCoupons());
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateCoupon(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String code,
            @RequestParam BigDecimal amount) {
        Long userId = principal != null ? principal.getId() : null;
        BigDecimal discount = couponService.validateAndCalculateDiscount(code, amount, userId);
        Coupon coupon = couponService.getCouponByCode(code);

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "code", coupon.getCode(),
                "discount", discount,
                "discountType", coupon.getDiscountType().name(),
                "discountValue", coupon.getDiscountValue()
        ));
    }
}
