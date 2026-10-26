import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import ProductCard from '../../components/product/ProductCard';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Flame } from 'lucide-react';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [featRes, bestRes, catRes] = await Promise.all([
          productApi.getFeatured(),
          productApi.getBestSellers(),
          categoryApi.getCategories(),
        ]);
        setFeatured(featRes || []);
        setBestSellers(bestRes || []);
        setCategories(catRes || []);
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      {/* Hero Promotional Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)',
          color: '#ffffff',
          padding: '64px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: 640 }}>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                marginBottom: 16,
                padding: '6px 12px',
                fontSize: 13,
              }}
            >
              <Sparkles size={14} /> NEW SEASON ARRIVALS 2026
            </span>
            <h1
              style={{
                fontSize: 44,
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: 18,
                letterSpacing: '-1px',
              }}
            >
              Curated Products for Your Elevated Lifestyle.
            </h1>
            <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 28, lineHeight: 1.5 }}>
              Discover genuine electronics, athletic gear, fashion, and books. Fast door delivery with secure Razorpay checkout.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/products" className="btn btn-dark btn-lg">
                <span>Explore Catalog</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/products?categoryId=1"
                className="btn btn-secondary btn-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#0f172a' }}
              >
                Top Tech Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="container" style={{ marginTop: 48 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Shop By Category</h2>
          <Link to="/products" style={{ color: '#2563eb', fontWeight: 600, fontSize: 14 }}>
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              className="card"
              style={{
                overflow: 'hidden',
                textDecoration: 'none',
                textAlign: 'center',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <img
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300'}
                alt={cat.name}
                style={{ width: 80, height: 80, borderRadius: 9999, objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Explore collection</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ marginTop: 56 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <div className="flex items-center gap-2">
            <Flame color="#ef4444" size={24} />
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Featured Deals</h2>
          </div>
          <Link to="/products" style={{ color: '#2563eb', fontWeight: 600, fontSize: 14 }}>
            See All Products →
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading products...</div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {featured.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Best Sellers */}
      <section className="container" style={{ marginTop: 56 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <div className="flex items-center gap-2">
            <TrendingUp color="#10b981" size={24} />
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Best Sellers</h2>
          </div>
          <Link to="/products" style={{ color: '#2563eb', fontWeight: 600, fontSize: 14 }}>
            Browse All →
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading products...</div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
