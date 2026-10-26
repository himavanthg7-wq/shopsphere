import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getOrderByNumber(orderNumber)
      .then((res) => setOrder(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 640 }}>
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 9999,
            backgroundColor: '#d1fae5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <CheckCircle2 size={44} />
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
          Order Confirmed!
        </h1>
        <p style={{ color: '#64748b', fontSize: 15, marginBottom: 24 }}>
          Thank you for your purchase. We have received your order and started preparing it for delivery.
        </p>

        {order && (
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: 20,
              textAlign: 'left',
              marginBottom: 28,
              fontSize: 14,
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <span style={{ color: '#64748b' }}>Order Number</span>
              <strong style={{ color: '#0f172a' }}>{order.orderNumber}</strong>
            </div>
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <span style={{ color: '#64748b' }}>Total Paid</span>
              <strong style={{ color: '#0f172a' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <span style={{ color: '#64748b' }}>Payment Status</span>
              <span className="badge badge-success">{order.paymentStatus}</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: '#64748b' }}>Estimated Delivery</span>
              <strong>Within 3-5 business days</strong>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <Link to={`/orders/${orderNumber}`} className="btn btn-primary">
            <Package size={16} />
            <span>Track Order Timeline</span>
          </Link>
          <Link to="/products" className="btn btn-secondary">
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
