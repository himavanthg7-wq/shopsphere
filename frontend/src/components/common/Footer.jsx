import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', marginTop: 60, borderTop: '1px solid #1e293b' }}>
      {/* Value Proposition Highlights */}
      <div style={{ borderBottom: '1px solid #1e293b', padding: '32px 0' }}>
        <div className="container grid grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#3b82f6', padding: 12, borderRadius: 12 }}>
              <Truck size={24} />
            </div>
            <div>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 15 }}>Free Shipping</div>
              <div style={{ fontSize: 13 }}>On orders above ₹999</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: 12, borderRadius: 12 }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 15 }}>Verified Purchases</div>
              <div style={{ fontSize: 13 }}>100% Authentic Products</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: 12, borderRadius: 12 }}>
              <RotateCcw size={24} />
            </div>
            <div>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 15 }}>Easy Returns</div>
              <div style={{ fontSize: 13 }}>7 Days Replacement Policy</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', padding: 12, borderRadius: 12 }}>
              <CreditCard size={24} />
            </div>
            <div>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 15 }}>Secure Checkout</div>
              <div style={{ fontSize: 13 }}>Razorpay & UPI Protected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '48px 20px' }}>
        <div className="grid grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ShoppingBag size={18} />
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc' }}>
                Shop<span style={{ color: '#3b82f6' }}>Sphere</span>
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              Full-Stack E-Commerce Platform built with Java Spring Boot 3, React, and MySQL. Featuring atomic inventory management, verified reviews, and Razorpay payment integration.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?categoryId=1">Electronics</Link></li>
              <li><Link to="/products?categoryId=2">Fashion</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Customer Care</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/profile">Shipping Addresses</Link></li>
              <li><span>Terms & Conditions</span></li>
              <li><span>Privacy Policy</span></li>
              <li><span>24x7 Customer Support</span></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Admin & Demo</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <li><Link to="/admin" style={{ color: '#60a5fa', fontWeight: 600 }}>Admin Portal</Link></li>
              <li><Link to="/login">Sign In / Switch Demo Account</Link></li>
              <li><span>API Documentation: /api/*</span></li>
              <li><span>MySQL 8 InnoDB Architecture</span></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', marginTop: 40, paddingTop: 20, textAlign: 'center', fontSize: 13 }}>
          © {new Date().getFullYear()} ShopSphere System. Built with Spring Boot 3, React, and MySQL. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
