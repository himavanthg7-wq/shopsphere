import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addressApi } from '../../api/addressApi';
import { orderApi } from '../../api/orderApi';
import { resetCart } from '../../store/cartSlice';
import { MapPin, Plus, CheckCircle2, ShieldCheck, CreditCard, Banknote, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); // RAZORPAY, COD
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // New Address Toggle
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    addressType: 'HOME',
  });

  useEffect(() => {
    addressApi.getAddresses().then((res) => {
      setAddresses(res || []);
      const def = res.find((a) => a.isDefault) || res[0];
      if (def) setSelectedAddressId(def.id);
    });
  }, []);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const created = await addressApi.createAddress(newAddress);
      setAddresses([created, ...addresses]);
      setSelectedAddressId(created.id);
      setShowAddressForm(false);
      setNewAddress({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        addressType: 'HOME',
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select or add a shipping address.');
      return;
    }

    try {
      setLoading(true);
      // 1. Create order on Spring Boot backend (atomic inventory deduction occurs here)
      const orderRes = await orderApi.createOrder({
        addressId: selectedAddressId,
        couponCode: cart.appliedCoupon,
        paymentMethod: paymentMethod,
        notes: orderNotes,
      });

      // 2. If Razorpay, execute test signature verification against backend HMAC-SHA256
      if (paymentMethod === 'RAZORPAY') {
        const verifyRes = await orderApi.verifyPayment({
          orderId: orderRes.id,
          razorpayOrderId: orderRes.razorpayOrderId || 'order_mock_test',
          razorpayPaymentId: 'pay_rzp_' + Math.random().toString(36).substring(2, 10),
          razorpaySignature: 'sig_demo_' + Math.random().toString(36).substring(2, 12),
        });
        dispatch(resetCart());
        navigate(`/order-confirmation/${verifyRes.orderNumber}`);
      } else {
        // COD order
        dispatch(resetCart());
        navigate(`/order-confirmation/${orderRes.orderNumber}`);
      }
    } catch (err) {
      alert('Order failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '36px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>
        Secure Checkout
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
        {/* Left Column: Address & Payment Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* 1. Address Section */}
          <div className="card" style={{ padding: 24 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <div className="flex items-center gap-2">
                <MapPin size={20} color="#2563eb" />
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Delivery Address</h3>
              </div>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={14} />
                <span>{showAddressForm ? 'Cancel' : 'Add New Address'}</span>
              </button>
            </div>

            {/* New Address Form */}
            {showAddressForm && (
              <form onSubmit={handleCreateAddress} style={{ backgroundColor: '#f8fafc', padding: 20, borderRadius: 10, marginBottom: 20 }}>
                <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 16 }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-sm">Save & Use Address</button>
              </form>
            )}

            {/* Saved Addresses List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: 16,
                    border: selectedAddressId === addr.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: 10,
                    backgroundColor: selectedAddressId === addr.id ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    style={{ marginTop: 4 }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{addr.fullName}</span>
                      <span className="badge badge-gray" style={{ fontSize: 11 }}>{addr.addressType}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                      {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Phone: {addr.phone}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="card" style={{ padding: 24 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
              <ShieldCheck size={20} color="#10b981" />
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Payment Method</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: 16,
                  border: paymentMethod === 'RAZORPAY' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: 10,
                  backgroundColor: paymentMethod === 'RAZORPAY' ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'RAZORPAY'}
                  onChange={() => setPaymentMethod('RAZORPAY')}
                />
                <CreditCard size={22} color="#2563eb" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Razorpay Online Gateway</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>UPI, Credit/Debit Cards, NetBanking with HMAC-SHA256 Verification</div>
                </div>
                <span className="badge badge-primary">Recommended</span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: 16,
                  border: paymentMethod === 'COD' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: 10,
                  backgroundColor: paymentMethod === 'COD' ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <Banknote size={22} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Cash On Delivery (COD)</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Pay in cash or UPI upon delivery</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div>
          <div className="card" style={{ padding: 24, position: 'sticky', top: 90 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Order Summary</h3>

            {/* Items Mini List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, maxHeight: 200, overflowY: 'auto' }}>
              {cart.items.map((it) => (
                <div key={it.itemId} className="flex items-center justify-between" style={{ fontSize: 13 }}>
                  <span style={{ color: '#334155', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {it.quantity}x {it.productName}
                  </span>
                  <span style={{ fontWeight: 600 }}>₹{it.subtotal.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid #f1f5f9', paddingTop: 14, fontSize: 13 }}>
              <div className="flex items-center justify-between">
                <span style={{ color: '#64748b' }}>Subtotal</span>
                <span>₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex items-center justify-between" style={{ color: '#10b981' }}>
                  <span>Discount ({cart.appliedCoupon})</span>
                  <span>-₹{cart.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span style={{ color: '#64748b' }}>Tax (18% GST)</span>
                <span>₹{cart.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: '#64748b' }}>Shipping</span>
                <span>{cart.shippingAmount === 0 ? 'FREE' : `₹${cart.shippingAmount}`}</span>
              </div>
              <div
                className="flex items-center justify-between"
                style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, marginTop: 4, fontSize: 18, fontWeight: 800, color: '#0f172a' }}
              >
                <span>Total Amount</span>
                <span>₹{cart.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddressId}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 24 }}
            >
              {loading ? 'Processing Order...' : `Pay ₹${cart.totalAmount.toLocaleString('en-IN')}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
