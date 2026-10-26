package com.shopsphere.controller;

import com.shopsphere.dto.request.PaymentVerificationRequest;
import com.shopsphere.dto.response.OrderResponse;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.OrderService;
import com.shopsphere.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;

    public PaymentController(PaymentService paymentService, OrderService orderService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, String>> getPaymentConfig() {
        return ResponseEntity.ok(Map.of("keyId", paymentService.getKeyId()));
    }

    @PostMapping("/verify")
    public ResponseEntity<OrderResponse> verifyPayment(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PaymentVerificationRequest request) {
        return ResponseEntity.ok(orderService.verifyPayment(principal.getId(), request));
    }
}
