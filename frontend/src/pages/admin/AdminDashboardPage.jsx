import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDashboardMetrics();
      setMetrics(res);
    } catch (err) {
      console.error('Error fetching admin metrics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRestock = async (productId) => {
    const qtyStr = prompt('Enter restock quantity to add to inventory:', '25');
    if (!qtyStr) return;
    const qty = parseInt(qtyStr, 10);
    if (isNaN(qty) || qty <= 0) {
      alert('Please enter a valid positive number');
      return;
    }
    try {
      await adminApi.updateInventory(productId, qty, 5);
      alert('Inventory restocked successfully!');
      loadMetrics();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, color: '#64748b' }}>Loading administrative dashboard metrics...</div>;
  }

  if (!metrics) {
    return <div style={{ padding: 40 }}>Unable to load analytics.</div>;
  }

  const kpis = [
    {
      title: 'Total Revenue',
      value: `₹${(metrics.totalSales || 0).toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: '#10b981',
      bg: '#ecfdf5',
      note: 'Verified paid orders',
    },
    {
      title: 'Total Orders',
      value: (metrics.totalOrders || 0).toLocaleString('en-IN'),
      icon: ShoppingBag,
      color: '#2563eb',
      bg: '#eff6ff',
      note: 'Placed across system',
    },
    {
      title: 'Active Customers',
      value: (metrics.totalCustomers || 0).toLocaleString('en-IN'),
      icon: Users,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      note: 'Registered customer accounts',
    },
    {
      title: 'Catalog Products',
      value: (metrics.totalProducts || 0).toLocaleString('en-IN'),
      icon: Package,
      color: '#f59e0b',
      bg: '#fffbeb',
      note: 'Active sellable items',
    },
  ];

  const maxSale = Math.max(...(metrics.monthlySales?.map((m) => m.sales) || [100000]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>Management Console & Analytics</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Real-time sales tracking, stock levels, and fulfillment performance.</p>
        </div>
        <button onClick={loadMetrics} className="btn btn-secondary btn-sm">
          Refresh Analytics
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="card" style={{ padding: 22 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>{kpi.title}</span>
                <div style={{ backgroundColor: kpi.bg, color: kpi.color, padding: 8, borderRadius: 8 }}>
                  <Icon size={20} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{kpi.note}</div>
            </div>
          );
        })}
      </div>

      {/* Charts & Status Breakdowns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24 }}>
        {/* Monthly Revenue Bar Visualization */}
        <div className="card" style={{ padding: 24 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>Monthly Revenue Growth</h3>
              <p style={{ fontSize: 12, color: '#64748b' }}>Aggregate sales by calendar month (₹)</p>
            </div>
            <span className="badge badge-primary flex items-center gap-1">
              <TrendingUp size={13} /> High Velocity
            </span>
          </div>

          <div style={{ height: 220, display: 'flex', alignItems: 'flex-end', gap: 20, paddingTop: 20, paddingBottom: 10, borderBottom: '1px solid #e2e8f0' }}>
            {metrics.monthlySales?.map((item, i) => {
              const heightPct = Math.max(15, Math.round((item.sales / maxSale) * 100));
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb' }}>
                    ₹{(item.sales / 1000).toFixed(0)}k
                  </div>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 42,
                      height: `${heightPct}%`,
                      backgroundColor: '#2563eb',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.4s ease',
                    }}
                    title={`${item.month}: ₹${item.sales.toLocaleString('en-IN')}`}
                  />
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Orders by Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(metrics.ordersByStatus || {}).map(([st, cnt]) => (
              <div key={st} className="flex items-center justify-between" style={{ padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{st}</span>
                <span className="badge badge-gray" style={{ fontSize: 12, fontWeight: 700 }}>
                  {cnt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Low Stock Alert Table */}
      {metrics.lowStockProducts && metrics.lowStockProducts.length > 0 && (
        <div className="card" style={{ padding: 24, borderLeft: '4px solid #f59e0b' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} color="#f59e0b" />
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#92400e' }}>
                Inventory Alerts: Low Stock Items ({metrics.lowStockProducts.length})
              </h3>
            </div>
            <Link to="/admin/inventory" className="btn btn-secondary btn-sm">Manage Stock</Link>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Stock Remaining</th>
                  <th>Reorder Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {metrics.lowStockProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <img
                          src={p.primaryImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=80'}
                          alt=""
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=80';
                          }}
                          style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }}
                        />
                        <strong style={{ fontSize: 13 }}>{p.name}</strong>
                      </div>
                    </td>
                    <td>{p.sku}</td>
                    <td>
                      <span className="badge badge-danger">
                        {p.stockQuantity} remaining
                      </span>
                    </td>
                    <td>{p.reorderLevel} units</td>
                    <td>
                      <button
                        onClick={() => handleQuickRestock(p.id)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: 12, padding: '4px 10px' }}
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Selling Products */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Top Selling Products</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Units Sold</th>
                <th>Total Revenue (₹)</th>
              </tr>
            </thead>
            <tbody>
              {metrics.topProducts?.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', color: '#94a3b8' }}>No completed orders recorded yet.</td>
                </tr>
              ) : (
                metrics.topProducts?.map((tp, idx) => (
                  <tr key={idx}>
                    <td><strong>{tp.name}</strong></td>
                    <td>{tp.quantitySold} units</td>
                    <td><strong>₹{tp.revenue?.toLocaleString('en-IN')}</strong></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
