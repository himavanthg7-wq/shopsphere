package com.shopsphere.dto.request;

import jakarta.validation.constraints.NotNull;

public class OrderCreateRequest {

    @NotNull(message = "Address ID is required")
    private Long addressId;

    private String couponCode;
    private String paymentMethod = "RAZORPAY"; // RAZORPAY, COD
    private String notes;

    public OrderCreateRequest() {}

    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
