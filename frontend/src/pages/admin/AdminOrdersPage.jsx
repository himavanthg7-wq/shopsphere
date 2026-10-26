import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { ClipboardList, Edit3, X, CheckCircle2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('PROCESSING');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOrders(0, 50);
      setOrders(res.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setTrackingNumber(ord.trackingNumber || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await adminApi.updateOrderStatus(selectedOrder.id, {
        status: newStatus,
        trackingNumber: trackingNumber,
      });
      alert(`Order ${selectedOrder.orderNumber} updated to ${newStatus}`);
      setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED': return 'badge-success';
      case 'CANCELLED': return 'badge-danger';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY': return 'badge-primary';
      default: return 'badge-warning';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Orders Fulfillment Lifecycle</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Track customer orders and advance shipping stages.</p>
        </div>
        <button onClick={loadOrders} className="btn btn-secondary btn-sm">Refresh Orders</button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Order Status</th>
              <th>Tracking Number</th>
              <th style={{ textAlign: 'right' }}>Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 30 }}>Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 30 }}>No orders recorded yet.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.orderNumber}</strong></td>
                  <td>
                    <div>{o.customerName}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{o.customerEmail}</div>
                  </td>
                  <td>{o.items?.length || 0} items</td>
                  <td><strong>₹{o.totalAmount?.toLocaleString('en-IN')}</strong></td>
                  <td>
                    <span className={`badge ${o.paymentStatus === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(o.orderStatus)}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td><code>{o.trackingNumber || '-'}</code></td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => openStatusModal(o)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: 12, padding: '4px 10px' }}
                    >
                      <Edit3 size={13} />
                      <span>Change Status</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: 480 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Update Order Status</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 8, marginBottom: 20, fontSize: 13 }}>
              <div>Order: <strong>{selectedOrder.orderNumber}</strong></div>
              <div>Customer: <strong>{selectedOrder.customerName}</strong></div>
              <div>Current Status: <span className={`badge ${getStatusBadge(selectedOrder.orderStatus)}`}>{selectedOrder.orderStatus}</span></div>
            </div>

            <form onSubmit={handleUpdateStatus}>
              <div className="form-group">
                <label className="form-label">Next Stage / Lifecycle Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="PLACED">PLACED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. TRK-DEL-98412"
                  className="form-input"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setSelectedOrder(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="btn btn-primary">
                  {updating ? 'Updating...' : 'Save & Notify Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
