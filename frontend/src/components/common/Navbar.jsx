import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { fetchCart } from '../../store/cartSlice';
import { fetchWishlist } from '../../store/wishlistSlice';
import {
  ShoppingBag,
  Heart,
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  PackageCheck,
  Tag
} from 'lucide-react';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user, isAdmin } = useSelector((state) => state.auth);
  const cartTotalItems = useSelector((state) => state.cart.totalItems);
  const wishlistCount = useSelector((state) => state.wishlist.products.length);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
      {/* Promotional Notification Strip */}
      <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '13px', padding: '6px 0', textAlign: 'center' }}>
        <div className="container flex items-center justify-center gap-2">
          <Tag size={14} color="#f59e0b" />
          <span>Festive Bonanza! Use coupon <strong>WELCOME10</strong> for 10% OFF | Free Shipping above ₹999</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="container" style={{ padding: '14px 20px' }}>
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                Shop<span style={{ color: '#2563eb' }}>Sphere</span>
              </span>
            </div>
          </Link>

          {/* Search Box */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 540, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 40, paddingRight: 80, height: 42, borderRadius: 9999 }}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', borderRadius: 9999, height: 34 }}
            >
              Search
            </button>
          </form>

          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <Link to="/products" className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
              All Products
            </Link>

            {/* Wishlist Icon */}
            <Link to="/wishlist" title="Wishlist" style={{ position: 'relative', padding: 8, color: '#334155', display: 'flex', alignItems: 'center' }}>
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span style={{ position: 'absolute', top: 2, right: 2, backgroundColor: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 9999, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" title="Shopping Cart" style={{ position: 'relative', padding: 8, color: '#334155', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={22} />
              {cartTotalItems > 0 && (
                <span style={{ position: 'absolute', top: 2, right: 2, backgroundColor: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 9999, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartTotalItems}
                </span>
              )}
            </Link>

            {/* User Account / Profile Dropdown */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 9999, padding: '6px 14px' }}
                >
                  <User size={16} />
                  <span>{user?.firstName || 'Account'}</span>
                </button>

                {userMenuOpen && (
                  <div
                    className="card animate-fade-in"
                    style={{ position: 'absolute', right: 0, top: '115%', width: 210, zIndex: 50, padding: '8px 0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  >
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.firstName} {user?.lastName}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{user?.email}</div>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2"
                        style={{ padding: '10px 16px', color: '#2563eb', fontWeight: 600, fontSize: 14 }}
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2"
                      style={{ padding: '10px 16px', fontSize: 14, color: '#334155' }}
                    >
                      <PackageCheck size={16} />
                      My Orders
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2"
                      style={{ padding: '10px 16px', fontSize: 14, color: '#334155' }}
                    >
                      <User size={16} />
                      My Profile & Addresses
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                      style={{ width: '100%', padding: '10px 16px', border: 'none', background: 'none', textAlign: 'left', color: '#ef4444', fontSize: 14, borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-primary btn-sm">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <nav style={{ display: 'flex', gap: 24, marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9', overflowX: 'auto', fontSize: 14, fontWeight: 500, color: '#475569' }}>
          <Link to="/products" style={{ color: '#2563eb', fontWeight: 600 }}>All Deals</Link>
          <Link to="/products?categoryId=1">Electronics</Link>
          <Link to="/products?categoryId=2">Fashion</Link>
          <Link to="/products?categoryId=3">Home & Living</Link>
          <Link to="/products?categoryId=4">Fitness & Sports</Link>
          <Link to="/products?categoryId=5">Books & Learning</Link>
        </nav>
      </div>
    </header>
  );
}
