package com.shopsphere.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendOrderConfirmation(String toEmail, String orderNumber, String totalAmount) {
        String subject = "Order Confirmation - " + orderNumber + " | ShopSphere";
        String message = String.format(
                "Hello,\n\nThank you for your order at ShopSphere!\nOrder ID: %s\nTotal Amount: %s\nStatus: PLACED\n\nWe will notify you when your items are shipped.",
                orderNumber, totalAmount
        );
        sendEmail(toEmail, subject, message);
    }

    public void sendOrderStatusUpdate(String toEmail, String orderNumber, String status, String trackingNumber) {
        String subject = "Order Update: " + status + " - " + orderNumber + " | ShopSphere";
        String message = String.format(
                "Hello,\n\nYour order %s status has been updated to: %s.\nTracking Number: %s\n\nThank you for shopping with us!",
                orderNumber, status, trackingNumber != null ? trackingNumber : "N/A"
        );
        sendEmail(toEmail, subject, message);
    }

    public void sendWelcomeEmail(String toEmail, String name) {
        String subject = "Welcome to ShopSphere!";
        String message = String.format(
                "Hello %s,\n\nWelcome to ShopSphere - your premier online shopping destination!\nUse coupon code WELCOME10 on your first order to get 10%% off.\n\nHappy Shopping!",
                name
        );
        sendEmail(toEmail, subject, message);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            if (mailSender != null) {
                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setTo(to);
                msg.setSubject(subject);
                msg.setText(body);
                mailSender.send(msg);
                log.info("Email successfully sent to {}", to);
            } else {
                log.info("[SIMULATED EMAIL] To: {} | Subject: {}\n{}", to, subject, body);
            }
        } catch (Exception e) {
            log.warn("Could not dispatch live email to {}. Fallback to log. Reason: {}", to, e.getMessage());
        }
    }
}
