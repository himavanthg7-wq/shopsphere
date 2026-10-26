import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { wishlistApi } from '../../api/wishlistApi';
import { setWishlistData } from '../../store/wishlistSlice';
import { setCartData } from '../../store/cartSlice';
import { cartApi } from '../../api/cartApi';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      wishlistApi.getWishlist().then((res) => dispatch(setWishlistData(res)));
    }
  }, [isAuthenticated, dispatch]);

  const handleMoveToCart = async (productId) => {
    try {
      const res = await wishlistApi.moveToCart(productId);
      dispatch(setWishlistData(res));
      const updatedCart = await cartApi.getCart();
      dispatch(setCartData(updatedCart));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await wishlistApi.removeFromWishlist(productId);
      dispatch(setWishlistData(res));
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <Heart size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Please sign in to view your wishlist</h2>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  if (!wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <Heart size={64} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Your wishlist is empty</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>Save items you love to review and purchase them later.</p>
        <Link to="/products" className="btn btn-primary">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '36px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>
        My Wishlist ({wishlist.products.length} items)
      </h1>

      <div className="grid grid-cols-4 gap-6">
        {wishlist.products.map((product) => (
          <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Link to={`/products/${product.id}`} style={{ backgroundColor: '#f8fafc', display: 'block' }}>
              <img
                src={product.primaryImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400';
                }}
                style={{ width: '100%', height: 200, objectFit: 'cover' }}
              />
            </Link>

            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{product.categoryName}</div>
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8, lineHeight: 1.4 }}>
                    {product.name}
                  </h3>
                </Link>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
                  ₹{(product.discountedPrice || product.price).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMoveToCart(product.id)}
                  className="btn btn-primary btn-sm flex-1"
                >
                  <ShoppingCart size={14} />
                  <span>Move to Cart</span>
                </button>
                <button
                  onClick={() => handleRemove(product.id)}
                  title="Remove"
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#ef4444', padding: '6px 8px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
