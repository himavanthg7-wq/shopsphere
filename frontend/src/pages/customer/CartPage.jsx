import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cartApi } from '../../api/cartApi';
import { couponApi } from '../../api/couponApi';
import { setCartData } from '../../store/cartSlice';
import { Trash2, ShoppingBag, ArrowRight, Tag, Check, AlertCircle } from 'lucide-react';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      cartApi.getCart().then((res) => dispatch(setCartData(res)));
    }
  }, [isAuthenticated, dispatch]);

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty <= 0) return;
    try {
      const res = await cartApi.updateCartItem(itemId, newQty);
      dispatch(setCartData(res));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await cartApi.removeCartItem(itemId);
      dispatch(setCartData(res));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setCouponLoading(true);
      setCouponFeedback(null);
      const res = await cartApi.getCart(couponCode.trim());
      dispatch(setCartData(res));
      if (res.discountAmount > 0) {
        setCouponFeedback({ type: 'success', text: `Coupon ${res.appliedCoupon} applied! Saved ₹${res.discountAmount}` });
      } else {
        setCouponFeedback({ type: 'error', text: 'Coupon criteria not met or minimum order value required.' });
      }
    } catch (err) {
      setCouponFeedback({ type: 'error', text: err.message });
    } finally {
      setCouponLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <ShoppingBag size={48} color="#2563eb" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Please sign in to view your cart</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>Your items will sync automatically across devices.</p>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <ShoppingBag size={64} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Your shopping cart is empty</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>Explore top picks and trending gadgets to get started.</p>
        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '36px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>
        Shopping Cart ({cart.totalItems} items)
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
        {/* Items List */}
        <div>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {cart.items.map((item) => (
                <div
                  key={item.itemId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: 20,
                  }}
                >
                  <img
                    src={item.productImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'}
                    alt={item.productName}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200';
                    }}
                    style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1 }}>
                    <Link
                      to={`/products/${item.productId}`}
                      style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}
                    >
                      {item.productName}
                    </Link>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                      Unit: ₹{item.discountedPrice.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: 8 }}>
                    <button
                      onClick={() => handleUpdateQuantity(item.itemId, item.quantity - 1)}
                      style={{ width: 32, height: 32, background: '#f8fafc', border: 'none', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ width: 36, textAlign: 'center', fontSize: 14, fontWeight: 700 }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.itemId, item.quantity + 1)}
                      style={{ width: 32, height: 32, background: '#f8fafc', border: 'none', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div style={{ width: 100, textAlign: 'right', fontWeight: 800, fontSize: 16 }}>
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleRemoveItem(item.itemId)}
                    title="Remove item"
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div>
          <div className="card" style={{ padding: 24, position: 'sticky', top: 90 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Order Summary</h3>

            {/* Promo Code Box */}
            <form onSubmit={handleApplyCoupon} style={{ marginBottom: 20 }}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Coupon (e.g. WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="form-input"
                  style={{ textTransform: 'uppercase', fontSize: 13 }}
                />
                <button type="submit" disabled={couponLoading} className="btn btn-secondary btn-sm">
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>

              {couponFeedback && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: couponFeedback.type === 'success' ? '#10b981' : '#ef4444',
                  }}
                >
                  {couponFeedback.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                  <span>{couponFeedback.text}</span>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid #f1f5f9', paddingTop: 16, fontSize: 14 }}>
              <div className="flex items-center justify-between">
                <span style={{ color: '#64748b' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {cart.discountAmount > 0 && (
                <div className="flex items-center justify-between" style={{ color: '#10b981' }}>
                  <span className="flex items-center gap-1">
                    <Tag size={14} />
                    Coupon Discount ({cart.appliedCoupon})
                  </span>
                  <span style={{ fontWeight: 700 }}>-₹{cart.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span style={{ color: '#64748b' }}>GST Tax (18%)</span>
                <span style={{ fontWeight: 600 }}>₹{cart.taxAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between">
                <span style={{ color: '#64748b' }}>Shipping Fee</span>
                <span style={{ fontWeight: 600 }}>
                  {cart.shippingAmount === 0 ? (
                    <span style={{ color: '#10b981' }}>FREE</span>
                  ) : (
                    `₹${cart.shippingAmount}`
                  )}
                </span>
              </div>

              <div
                className="flex items-center justify-between"
                style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14, marginTop: 4, fontSize: 18, fontWeight: 800, color: '#0f172a' }}
              >
                <span>Total Amount</span>
                <span>₹{cart.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 24 }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
