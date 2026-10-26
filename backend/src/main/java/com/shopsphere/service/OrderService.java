package com.shopsphere.service;

import com.shopsphere.dto.request.OrderCreateRequest;
import com.shopsphere.dto.request.OrderStatusUpdateRequest;
import com.shopsphere.dto.request.PaymentVerificationRequest;
import com.shopsphere.dto.response.CartResponse;
import com.shopsphere.dto.response.OrderResponse;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final InventoryService inventoryService;
    private final PaymentService paymentService;
    private final CouponService couponService;
    private final CouponUsageRepository couponUsageRepository;
    private final EmailService emailService;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        PaymentRepository paymentRepository,
                        AddressRepository addressRepository,
                        UserRepository userRepository,
                        CartService cartService,
                        InventoryService inventoryService,
                        PaymentService paymentService,
                        CouponService couponService,
                        CouponUsageRepository couponUsageRepository,
                        EmailService emailService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.cartService = cartService;
        this.inventoryService = inventoryService;
        this.paymentService = paymentService;
        this.couponService = couponService;
        this.couponUsageRepository = couponUsageRepository;
        this.emailService = emailService;
    }

    @Transactional
    public OrderResponse createOrder(Long userId, OrderCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + request.getAddressId()));

        Cart cart = cartService.getOrCreateCart(userId);
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty. Cannot checkout an empty cart.");
        }

        CartResponse cartSummary = cartService.getCartResponse(userId, request.getCouponCode());

        // Validate stock before placing order
        for (CartItem ci : cart.getItems()) {
            Product p = ci.getProduct();
            int available = (p.getInventory() != null) ? p.getInventory().getQuantity() : 0;
            if (available < ci.getQuantity()) {
                throw new BadRequestException("Insufficient stock for " + p.getName() +
                        ". Available: " + available + ", in cart: " + ci.getQuantity());
            }
        }

        String orderNumber = "ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) +
                "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setAddress(address);
        order.setSubtotal(cartSummary.getSubtotal());
        order.setDiscountAmount(cartSummary.getDiscountAmount());
        order.setTaxAmount(cartSummary.getTaxAmount());
        order.setShippingAmount(cartSummary.getShippingAmount());
        order.setTotalAmount(cartSummary.getTotalAmount());
        order.setCouponCode(cartSummary.getAppliedCoupon());
        order.setNotes(request.getNotes());
        order.setTrackingNumber("TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        boolean isCod = "COD".equalsIgnoreCase(request.getPaymentMethod());
        order.setOrderStatus(isCod ? OrderStatus.CONFIRMED : OrderStatus.PLACED);
        order.setPaymentStatus(isCod ? PaymentStatus.PENDING : PaymentStatus.PENDING);

        Order savedOrder = orderRepository.save(order);

        // Convert cart items to order items and deduct inventory atomically
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cart.getItems()) {
            Product p = ci.getProduct();
            OrderItem item = new OrderItem();
            item.setOrder(savedOrder);
            item.setProduct(p);
            item.setProductName(p.getName());
            item.setQuantity(ci.getQuantity());
            item.setUnitPrice(p.getDiscountedPrice());
            item.setSubtotal(p.getDiscountedPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));

            String img = p.getImages().isEmpty() ? null : p.getImages().get(0).getImageUrl();
            item.setProductImage(img);

            orderItems.add(orderItemRepository.save(item));

            // Atomic stock deduction
            inventoryService.deductStock(p, ci.getQuantity());
        }
        savedOrder.setItems(orderItems);

        // Create Payment record
        Payment payment = new Payment(savedOrder, request.getPaymentMethod(), cartSummary.getTotalAmount());
        if (!isCod) {
            String rzpOrderId = paymentService.createOrder(cartSummary.getTotalAmount(), orderNumber);
            payment.setRazorpayOrderId(rzpOrderId);
        } else {
            payment.setStatus("PENDING");
            payment.setTransactionId("COD-" + savedOrder.getId());
        }
        paymentRepository.save(payment);
        savedOrder.setPayment(payment);

        // Record coupon usage
        if (cartSummary.getAppliedCoupon() != null) {
            try {
                Coupon coupon = couponService.getCouponByCode(cartSummary.getAppliedCoupon());
                coupon.setUsedCount(coupon.getUsedCount() + 1);
                couponUsageRepository.save(new CouponUsage(coupon, user, savedOrder));
            } catch (Exception ignored) {}
        }

        // Clear cart after checkout
        cartService.clearCart(userId);

        // Send Email notification
        emailService.sendOrderConfirmation(user.getEmail(), orderNumber, "₹" + cartSummary.getTotalAmount());

        return OrderResponse.fromEntity(savedOrder);
    }

    @Transactional
    public OrderResponse verifyPayment(Long userId, PaymentVerificationRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to order.");
        }

        Payment payment = order.getPayment();
        if (payment == null) {
            throw new BadRequestException("No payment record found for order.");
        }

        boolean isValid = paymentService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!isValid) {
            payment.setStatus("FAILED");
            paymentRepository.save(payment);
            throw new BadRequestException("Payment verification failed: Invalid signature.");
        }

        payment.setRazorpayOrderId(request.getRazorpayOrderId());
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setTransactionId(request.getRazorpayPaymentId());
        payment.setStatus("SUCCESS");
        paymentRepository.save(payment);

        order.setPaymentStatus(PaymentStatus.COMPLETED);
        order.setOrderStatus(OrderStatus.CONFIRMED);
        Order updated = orderRepository.save(order);

        return OrderResponse.fromEntity(updated);
    }

    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderByNumber(String orderNumber, Long userId, boolean isAdmin) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));

        if (!isAdmin && !order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied to requested order.");
        }
        return OrderResponse.fromEntity(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long userId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!isAdmin && !order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied to order cancellation.");
        }

        if (order.getOrderStatus() == OrderStatus.DELIVERED || order.getOrderStatus() == OrderStatus.SHIPPED) {
            throw new BadRequestException("Cannot cancel an order that is already " + order.getOrderStatus());
        }

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled.");
        }

        // Restore stock for all ordered items
        for (OrderItem item : order.getItems()) {
            if (item.getProduct() != null) {
                inventoryService.restoreStock(item.getProduct(), item.getQuantity());
            }
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        if (order.getPaymentStatus() == PaymentStatus.COMPLETED) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
            if (order.getPayment() != null) {
                order.getPayment().setStatus("REFUNDED");
                paymentRepository.save(order.getPayment());
            }
        }

        Order cancelled = orderRepository.save(order);
        emailService.sendOrderStatusUpdate(order.getUser().getEmail(), order.getOrderNumber(), "CANCELLED", null);

        return OrderResponse.fromEntity(cancelled);
    }

    public Page<OrderResponse> getAllOrders(int page, int size) {
        return orderRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(OrderResponse::fromEntity);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setOrderStatus(request.getStatus());
        if (request.getTrackingNumber() != null && !request.getTrackingNumber().trim().isEmpty()) {
            order.setTrackingNumber(request.getTrackingNumber().trim());
        }

        // If delivered and COD, update payment status to COMPLETED
        if (request.getStatus() == OrderStatus.DELIVERED && order.getPaymentStatus() == PaymentStatus.PENDING) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
            if (order.getPayment() != null) {
                order.getPayment().setStatus("SUCCESS");
                paymentRepository.save(order.getPayment());
            }
        }

        Order updated = orderRepository.save(order);
        emailService.sendOrderStatusUpdate(order.getUser().getEmail(), order.getOrderNumber(),
                request.getStatus().name(), order.getTrackingNumber());

        return OrderResponse.fromEntity(updated);
    }
}
