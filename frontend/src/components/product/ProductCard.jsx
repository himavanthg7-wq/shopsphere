import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { cartApi } from '../../api/cartApi';
import { wishlistApi } from '../../api/wishlistApi';
import { setCartData } from '../../store/cartSlice';
import { setWishlistData } from '../../store/wishlistSlice';

export default function ProductCard({ product }) {
  const [addingCart, setAddingCart] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlistProducts = useSelector((state) => state.wishlist.products);
  const isInWishlist = wishlistProducts?.some((p) => p.id === product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      setAddingCart(true);
      const res = await cartApi.addToCart(product.id, 1);
      dispatch(setCartData(res));
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingCart(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      setTogglingWishlist(true);
      if (isInWishlist) {
        const res = await wishlistApi.removeFromWishlist(product.id);
        dispatch(setWishlistData(res));
      } else {
        const res = await wishlistApi.addToWishlist(product.id);
        dispatch(setWishlistData(res));
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setTogglingWishlist(false);
    }
  };

  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {/* Discount Badge */}
      {hasDiscount && (
        <span
          className="badge badge-danger"
          style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, padding: '4px 8px', fontWeight: 700 }}
        >
          {Math.round(product.discountPercent)}% OFF
        </span>
      )}

      {/* Wishlist Heart Button */}
      <button
        onClick={handleToggleWishlist}
        title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        disabled={togglingWishlist}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: 9999,
          width: 34,
          height: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        <Heart size={18} color={isInWishlist ? '#ef4444' : '#64748b'} fill={isInWishlist ? '#ef4444' : 'none'} />
      </button>

      {/* Product Image */}
      <Link to={`/products/${product.id}`} style={{ display: 'block', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
        <img
          src={product.primaryImageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
          alt={product.name}
          style={{
            width: '100%',
            height: 220,
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </Link>

      {/* Details Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between" style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
            <span>{product.brandName || 'ShopSphere'}</span>
            <span>{product.categoryName}</span>
          </div>

          {/* Title */}
          <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#0f172a',
                lineHeight: 1.4,
                marginBottom: 8,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: 42,
              }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
            <div className="flex items-center gap-1" style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700 }}>
              <Star size={15} fill="#f59e0b" color="#f59e0b" />
              <span>{product.ratingAvg > 0 ? product.ratingAvg.toFixed(1) : 'New'}</span>
            </div>
            {product.ratingCount > 0 && (
              <span style={{ fontSize: 12, color: '#94a3b8' }}>({product.ratingCount} reviews)</span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div>
          <div className="flex items-baseline gap-2" style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 19, fontWeight: 800, color: '#0f172a' }}>
              ₹{(product.discountedPrice || product.price).toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: 14, color: '#94a3b8', textDecoration: 'line-through' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {isOutOfStock ? (
            <button className="btn btn-secondary btn-sm" disabled style={{ width: '100%', opacity: 0.6 }}>
              Out of Stock
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={addingCart}
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
            >
              <ShoppingCart size={15} />
              <span>{addingCart ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
