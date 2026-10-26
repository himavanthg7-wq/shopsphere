import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { Package, ArrowRight, Clock } from 'lucide-react';

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getMyOrders()
      .then((res) => setOrders(res || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'DELIVERED': return 'badge-success';
      case 'CANCELLED': return 'badge-danger';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY': return 'badge-primary';
      default: return 'badge-warning';
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Loading your orders...</div>;
  }

  return (
    <div className="container" style={{ padding: '36px 20px', maxWidth: 900 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>
        My Order History
      </h1>

      {orders.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <Package size={56} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No orders placed yet</h3>
          <p style={{ color: '#64748b', marginBottom: 20 }}>When you purchase items, they will appear here with real-time status updates.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map((ord) => (
            <div key={ord.id} className="card" style={{ padding: 24 }}>
              <div
                className="flex items-center justify-between"
                style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 14, marginBottom: 16, flexWrap: 'wrap', gap: 10 }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>{ord.orderNumber}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`badge ${getStatusBadgeClass(ord.orderStatus)}`}>
                    {ord.orderStatus}
                  </span>
                  <Link to={`/orders/${ord.orderNumber}`} className="btn btn-secondary btn-sm">
                    <span>View Tracking</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Items row */}
              <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
                {ord.items?.map((it) => (
                  <div key={it.id} className="flex items-center gap-2" style={{ backgroundColor: '#f8fafc', padding: '6px 12px', borderRadius: 8 }}>
                    <img
                      src={it.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                      alt=""
                      style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }}
                    />
                    <div style={{ fontSize: 13, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {it.quantity}x {it.productName}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between" style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #f1f5f9', fontSize: 14 }}>
                <span style={{ color: '#64748b' }}>Total Paid: <strong>₹{ord.totalAmount?.toLocaleString('en-IN')}</strong></span>
                <span style={{ color: '#64748b', fontSize: 13 }}>Tracking ID: {ord.trackingNumber || 'Pending'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
