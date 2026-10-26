import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productApi } from '../../api/productApi';
import { cartApi } from '../../api/cartApi';
import { wishlistApi } from '../../api/wishlistApi';
import { reviewApi } from '../../api/reviewApi';
import { setCartData } from '../../store/cartSlice';
import { setWishlistData } from '../../store/wishlistSlice';
import ProductCard from '../../components/product/ProductCard';
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingCart, setAddingCart] = useState(false);

  // Review Form
  const [userRating, setUserRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlistProducts = useSelector((state) => state.wishlist.products);
  const isInWishlist = wishlistProducts?.some((p) => p.id === product?.id);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const [prod, rel, revs] = await Promise.all([
          productApi.getProductById(id),
          productApi.getRelated(id),
          reviewApi.getProductReviews(id, 0, 10),
        ]);
        setProduct(prod);
        setSelectedImage(prod.primaryImageUrl || prod.imageUrls?.[0] || '');
        setRelated(rel || []);
        setReviews(revs.content || []);
      } catch (err) {
        console.error('Error loading product details', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setAddingCart(true);
      const res = await cartApi.addToCart(product.id, quantity);
      dispatch(setCartData(res));
      alert(`Added ${quantity} item(s) to cart!`);
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setAddingCart(true);
      const res = await cartApi.addToCart(product.id, quantity);
      dispatch(setCartData(res));
      navigate('/checkout');
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      if (isInWishlist) {
        const res = await wishlistApi.removeFromWishlist(product.id);
        dispatch(setWishlistData(res));
      } else {
        const res = await wishlistApi.addToWishlist(product.id);
        dispatch(setWishlistData(res));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setSubmittingReview(true);
      setReviewMessage(null);
      await reviewApi.addReview({
        productId: product.id,
        rating: userRating,
        comment: reviewComment,
      });
      setReviewMessage({ type: 'success', text: 'Thank you! Your verified review has been published.' });
      setReviewComment('');
      // Refresh reviews & product stats
      const [updatedProd, updatedRevs] = await Promise.all([
        productApi.getProductById(product.id),
        reviewApi.getProductReviews(product.id, 0, 10),
      ]);
      setProduct(updatedProd);
      setReviews(updatedRevs.content || []);
    } catch (err) {
      setReviewMessage({ type: 'error', text: err.message });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Loading product details...</div>;
  }

  if (!product) {
    return <div className="container" style={{ padding: 60, textAlign: 'center' }}>Product not found.</div>;
  }

  const stock = product.stockQuantity || 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= (product.reorderLevel || 5);
  const hasDiscount = product.discountPercent && product.discountPercent > 0;

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
        <Link to="/" style={{ color: '#2563eb' }}>Home</Link> /{' '}
        <Link to={`/products?categoryId=${product.categoryId}`} style={{ color: '#2563eb' }}>{product.categoryName}</Link> /{' '}
        <span>{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 56 }}>
        {/* Left: Images */}
        <div>
          {/* Main Display */}
          <div
            className="card"
            style={{
              overflow: 'hidden',
              backgroundColor: '#f8fafc',
              height: 440,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <img
              src={selectedImage}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600';
              }}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Thumbnails */}
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="flex items-center gap-3" style={{ overflowX: 'auto', paddingBottom: 8 }}>
              {product.imageUrls.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    border: selectedImage === img ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: 'none',
                    padding: 0,
                    width: 72,
                    height: 72,
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
              {product.brandName || 'ShopSphere'}
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>SKU: {product.sku}</span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: 12 }}>
            {product.name}
          </h1>

          {/* Star Rating */}
          <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
            <div className="flex items-center gap-1" style={{ color: '#f59e0b', fontWeight: 700 }}>
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
              <span>{product.ratingAvg > 0 ? product.ratingAvg.toFixed(1) : 'New'}</span>
            </div>
            <span style={{ color: '#94a3b8', fontSize: 13 }}>•</span>
            <span style={{ color: '#64748b', fontSize: 13 }}>{product.ratingCount || 0} Customer Reviews</span>
            <span style={{ color: '#94a3b8', fontSize: 13 }}>•</span>
            <span className="badge badge-primary">Verified Reviews</span>
          </div>

          {/* Pricing */}
          <div className="card" style={{ padding: 20, backgroundColor: '#f8fafc', marginBottom: 24 }}>
            <div className="flex items-baseline gap-3">
              <span style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }}>
                ₹{(product.discountedPrice || product.price).toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <>
                  <span style={{ fontSize: 18, color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="badge badge-danger">
                    Save {Math.round(product.discountPercent)}%
                  </span>
                </>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
              Inclusive of all taxes. Free delivery on orders over ₹999.
            </div>
          </div>

          {/* Stock Indicator */}
          <div style={{ marginBottom: 24 }}>
            {isOutOfStock ? (
              <div className="flex items-center gap-2" style={{ color: '#ef4444', fontWeight: 600 }}>
                <XCircle size={18} />
                <span>Currently Out of Stock</span>
              </div>
            ) : isLowStock ? (
              <div className="flex items-center gap-2" style={{ color: '#d97706', fontWeight: 600 }}>
                <AlertTriangle size={18} />
                <span>Hurry! Only {stock} items left in stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-2" style={{ color: '#10b981', fontWeight: 600 }}>
                <CheckCircle2 size={18} />
                <span>In Stock ({stock} units available)</span>
              </div>
            )}
          </div>

          {/* Quantity Selector & Purchase Actions */}
          {!isOutOfStock && (
            <div className="flex items-center gap-4" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: 8, overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: 38, height: 42, background: '#f8fafc', border: 'none', fontSize: 16, cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ width: 44, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  style={{ width: 38, height: 42, background: '#f8fafc', border: 'none', fontSize: 16, cursor: 'pointer' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingCart}
                className="btn btn-primary btn-lg flex-1"
              >
                <ShoppingCart size={18} />
                <span>{addingCart ? 'Adding...' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="btn btn-dark btn-lg flex-1"
              >
                <Zap size={18} />
                <span>Buy Now</span>
              </button>

              <button
                onClick={handleToggleWishlist}
                title="Save to Wishlist"
                className="btn btn-secondary"
                style={{ height: 48, width: 48, padding: 0 }}
              >
                <Heart size={20} color={isInWishlist ? '#ef4444' : '#64748b'} fill={isInWishlist ? '#ef4444' : 'none'} />
              </button>
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3" style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
            <div className="flex items-center gap-2" style={{ fontSize: 12, color: '#64748b' }}>
              <Truck size={18} color="#2563eb" />
              <span>Doorstep Delivery</span>
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: 12, color: '#64748b' }}>
              <RotateCcw size={18} color="#10b981" />
              <span>7 Days Return</span>
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: 12, color: '#64748b' }}>
              <ShieldCheck size={18} color="#a855f7" />
              <span>100% Authentic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specs */}
      <div className="card" style={{ padding: 32, marginBottom: 48 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Product Description</h3>
        <p style={{ lineHeight: 1.7, color: '#334155', fontSize: 15 }}>
          {product.description || 'No detailed description provided.'}
        </p>
      </div>

      {/* Verified Reviews Section */}
      <div className="card" style={{ padding: 32, marginBottom: 56 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 24, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>Customer Reviews & Ratings</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
              Only customers with completed and delivered purchases can submit verified reviews.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>
              {product.ratingAvg > 0 ? product.ratingAvg.toFixed(1) : '0.0'}
            </span>
            <div className="flex items-center gap-1">
              <Star size={20} fill="#f59e0b" color="#f59e0b" />
            </div>
          </div>
        </div>

        {/* Submit Review Box */}
        <div style={{ backgroundColor: '#f8fafc', padding: 24, borderRadius: 12, marginBottom: 32 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Write a Verified Review</h4>
          {reviewMessage && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                marginBottom: 16,
                fontSize: 13,
                backgroundColor: reviewMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                color: reviewMessage.type === 'success' ? '#065f46' : '#991b1b',
              }}
            >
              {reviewMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmitReview}>
            <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setUserRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                  >
                    <Star
                      size={22}
                      fill={star <= userRating ? '#f59e0b' : 'none'}
                      color={star <= userRating ? '#f59e0b' : '#cbd5e1'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <textarea
                placeholder="Share your experience with this item..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
                className="form-textarea"
                rows={3}
              />
            </div>

            <button type="submit" disabled={submittingReview} className="btn btn-primary btn-sm">
              {submittingReview ? 'Verifying Purchase & Submitting...' : 'Submit Verified Review'}
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div>
          {reviews.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: 14 }}>No reviews yet. Be the first verified customer to review this product!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{r.userName}</span>
                      <span className="badge badge-success" style={{ fontSize: 11 }}>
                        <CheckCircle2 size={12} /> Verified Purchase
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1" style={{ marginBottom: 8 }}>
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={14}
                        fill={idx < r.rating ? '#f59e0b' : 'none'}
                        color={idx < r.rating ? '#f59e0b' : '#cbd5e1'}
                      />
                    ))}
                  </div>

                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.5 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Related Products in {product.categoryName}</h3>
          <div className="grid grid-cols-4 gap-6">
            {related.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
