import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import {
  LayoutDashboard,
  Package,
  Layers,
  ClipboardList,
  Boxes,
  TicketPercent,
  Users,
  Store,
  LogOut,
  ShoppingBag
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { label: 'Overview & Analytics', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Orders Lifecycle', path: '/admin/orders', icon: ClipboardList },
    { label: 'Inventory & Alerts', path: '/admin/inventory', icon: Boxes },
    { label: 'Coupons Engine', path: '/admin/coupons', icon: TicketPercent },
    { label: 'Customer Accounts', path: '/admin/customers', icon: Users },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          backgroundColor: '#0f172a',
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 30,
        }}
      >
        {/* Brand */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <ShoppingBag size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#f8fafc' }}>ShopSphere</div>
            <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600, letterSpacing: '0.5px' }}>ADMIN CONSOLE</div>
          </div>
        </div>

        {/* Links */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#ffffff' : '#94a3b8',
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div style={{ height: 1, backgroundColor: '#1e293b', margin: '16px 0' }} />

          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 14,
              color: '#38bdf8',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Store size={18} />
            <span>Customer View</span>
          </Link>
        </nav>

        {/* User bar */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{user?.firstName || 'Admin'}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Super Administrator</div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 6 }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <header
          style={{
            height: 64,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 600, color: '#475569' }}>
            System Architecture: Spring Boot 3 + MySQL 8 + React
          </div>
          <div className="flex items-center gap-3">
            <span className="badge badge-success">● System Operational</span>
            <span style={{ fontSize: 13, color: '#64748b' }}>{user?.email}</span>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ padding: '28px', flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
