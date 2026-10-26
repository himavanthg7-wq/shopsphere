package com.shopsphere;

import com.shopsphere.entity.DiscountType;
import com.shopsphere.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ShopSphereApplicationTests {

    @Autowired
    private PaymentService paymentService;

    @Test
    void contextLoads() {
        assertNotNull(paymentService);
    }

    @Test
    void testPaymentMockSignatureVerification() {
        boolean valid = paymentService.verifySignature("order_demo_1001", "pay_demo_1001", "sig_demo_12345");
        assertTrue(valid);
    }
}
