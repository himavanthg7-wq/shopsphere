import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { Boxes, AlertTriangle, CheckCircle2, Edit2, X } from 'lucide-react';

export default function AdminInventoryPage() {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit stock modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [reorderLevel, setReorderLevel] = useState(5);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getInventory();
      setInventories(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setQuantity(item.quantity);
    setReorderLevel(item.reorderLevel);
  };

  const handleSaveStock = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminApi.updateInventory(selectedItem.productId, parseInt(quantity, 10), parseInt(reorderLevel, 10));
      alert('Stock updated successfully!');
      setSelectedItem(null);
      loadInventory();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Real-Time Inventory & Stock Alerts</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Monitor stock levels and manage reorder thresholds.</p>
        </div>
        <button onClick={loadInventory} className="btn btn-secondary btn-sm">Refresh Stock</button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Units In Stock</th>
              <th>Reorder Threshold</th>
              <th>Alert Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30 }}>Loading stock...</td></tr>
            ) : inventories.map((it) => (
              <tr key={it.id}>
                <td><strong>{it.productName}</strong></td>
                <td><code>{it.sku}</code></td>
                <td>
                  <span style={{ fontSize: 16, fontWeight: 800, color: it.isLowStock ? '#dc2626' : '#0f172a' }}>
                    {it.quantity}
                  </span>
                </td>
                <td>{it.reorderLevel} units</td>
                <td>
                  {it.isLowStock ? (
                    <span className="badge badge-danger flex items-center gap-1" style={{ width: 'fit-content' }}>
                      <AlertTriangle size={12} /> Low Stock Alert
                    </span>
                  ) : (
                    <span className="badge badge-success flex items-center gap-1" style={{ width: 'fit-content' }}>
                      <CheckCircle2 size={12} /> Optimal
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => openEditModal(it)} className="btn btn-primary btn-sm" style={{ fontSize: 12, padding: '4px 10px' }}>
                    <Edit2 size={13} />
                    <span>Adjust Stock</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Modal */}
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: 440 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Adjust Stock Level</h3>
              <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 18, fontSize: 13 }}>
              Product: <strong>{selectedItem.productName}</strong>
            </div>

            <form onSubmit={handleSaveStock}>
              <div className="form-group">
                <label className="form-label">Available Physical Quantity</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Reorder Level (Triggers Alert)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setSelectedItem(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : 'Update Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
