import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import OrderTimeline from '../../components/order/OrderTimeline';
import { ArrowLeft, Printer, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function OrderDetailsPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderApi.getOrderByNumber(orderNumber)
      .then((res) => setOrder(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? The inventory will be restored.')) return;
    try {
      setCancelling(true);
      const res = await orderApi.cancelOrder(order.id);
      setOrder(res);
      alert('Order cancelled successfully.');
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="container" style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Loading order details...</div>;
  }

  if (!order) {
    return <div className="container" style={{ padding: 60, textAlign: 'center' }}>Order not found.</div>;
  }

  const canCancel = order.orderStatus === 'PLACED' || order.orderStatus === 'CONFIRMED';

  return (
    <div className="container" style={{ padding: '36px 20px', maxWidth: 960 }}>
      {/* Top back navigation */}
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <Link to="/orders" className="flex items-center gap-2" style={{ color: '#2563eb', fontWeight: 600, fontSize: 14 }}>
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
        <button onClick={handlePrint} className="btn btn-secondary btn-sm">
          <Printer size={14} />
          Print / Download Invoice
        </button>
      </div>

      {/* Main card */}
      <div className="card" style={{ padding: 32, marginBottom: 24 }}>
        <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
              Order #{order.orderNumber}
            </h1>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="badge badge-primary" style={{ fontSize: 13, padding: '6px 12px' }}>
              Status: {order.orderStatus}
            </span>
            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="btn btn-danger btn-sm"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* Timeline tracker */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Order Progress</h3>
          <OrderTimeline status={order.orderStatus} />
        </div>

        {/* Address and Payment details */}
        <div className="grid grid-cols-2 gap-6" style={{ marginBottom: 32, borderTop: '1px solid #f1f5f9', paddingTop: 24 }}>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Delivery Address</h4>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{order.shippingAddressString}</p>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Payment Details</h4>
            <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
              <div>Method: <strong>{order.paymentMethod || 'Online'}</strong></div>
              <div>Status: <strong>{order.paymentStatus}</strong></div>
              <div>Tracking ID: <strong>{order.trackingNumber || 'Assigned upon dispatch'}</strong></div>
            </div>
          </div>
        </div>

        {/* Ordered items table */}
        <div style={{ marginBottom: 32 }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Items in this Order</h4>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Unit Price</th>
                  <th>Qty</th>
                  <th style={{ textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((it) => (
                  <tr key={it.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={it.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                          alt=""
                          style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }}
                        />
                        <Link to={`/products/${it.productId}`} style={{ fontWeight: 600, color: '#0f172a' }}>
                          {it.productName}
                        </Link>
                      </div>
                    </td>
                    <td>₹{it.unitPrice?.toLocaleString('en-IN')}</td>
                    <td>{it.quantity}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{it.subtotal?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculation summary */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <div className="flex items-center justify-between">
              <span style={{ color: '#64748b' }}>Subtotal</span>
              <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex items-center justify-between" style={{ color: '#10b981' }}>
                <span>Discount ({order.couponCode})</span>
                <span>-₹{order.discountAmount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span style={{ color: '#64748b' }}>Tax (18% GST)</span>
              <span>₹{order.taxAmount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: '#64748b' }}>Shipping</span>
              <span>{order.shippingAmount === 0 ? 'FREE' : `₹${order.shippingAmount}`}</span>
            </div>
            <div
              className="flex items-center justify-between"
              style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, marginTop: 4, fontSize: 18, fontWeight: 800, color: '#0f172a' }}
            >
              <span>Total Paid</span>
              <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
