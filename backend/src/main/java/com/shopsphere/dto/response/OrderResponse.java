package com.shopsphere.dto.response;

import com.shopsphere.entity.Address;
import com.shopsphere.entity.Order;
import com.shopsphere.entity.OrderStatus;
import com.shopsphere.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponse {

    private Long id;
    private String orderNumber;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private String shippingAddressString;
    private List<OrderItemResponse> items = new ArrayList<>();
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal shippingAmount;
    private BigDecimal totalAmount;
    private String couponCode;
    private OrderStatus orderStatus;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private String trackingNumber;
    private String notes;
    private String razorpayOrderId;
    private LocalDateTime createdAt;

    public OrderResponse() {}

    public static OrderResponse fromEntity(Order order) {
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
        res.setOrderNumber(order.getOrderNumber());
        if (order.getUser() != null) {
            res.setUserId(order.getUser().getId());
            res.setCustomerName(order.getUser().getFirstName() + " " + order.getUser().getLastName());
            res.setCustomerEmail(order.getUser().getEmail());
        }

        if (order.getAddress() != null) {
            Address a = order.getAddress();
            res.setShippingAddressString(a.getFullName() + ", " + a.getStreet() + ", " +
                    a.getCity() + ", " + a.getState() + " - " + a.getPostalCode() + ", Phone: " + a.getPhone());
        }

        if (order.getItems() != null) {
            res.setItems(order.getItems().stream().map(OrderItemResponse::fromEntity).collect(Collectors.toList()));
        }

        res.setSubtotal(order.getSubtotal());
        res.setDiscountAmount(order.getDiscountAmount());
        res.setTaxAmount(order.getTaxAmount());
        res.setShippingAmount(order.getShippingAmount());
        res.setTotalAmount(order.getTotalAmount());
        res.setCouponCode(order.getCouponCode());
        res.setOrderStatus(order.getOrderStatus());
        res.setPaymentStatus(order.getPaymentStatus());
        res.setTrackingNumber(order.getTrackingNumber());
        res.setNotes(order.getNotes());
        res.setCreatedAt(order.getCreatedAt());

        if (order.getPayment() != null) {
            res.setPaymentMethod(order.getPayment().getPaymentMethod());
            res.setRazorpayOrderId(order.getPayment().getRazorpayOrderId());
        }

        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getShippingAddressString() { return shippingAddressString; }
    public void setShippingAddressString(String shippingAddressString) { this.shippingAddressString = shippingAddressString; }

    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public BigDecimal getShippingAmount() { return shippingAmount; }
    public void setShippingAmount(BigDecimal shippingAmount) { this.shippingAmount = shippingAmount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public OrderStatus getOrderStatus() { return orderStatus; }
    public void setOrderStatus(OrderStatus orderStatus) { this.orderStatus = orderStatus; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
