import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, addReview, toggleWishlist } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, fetchUser } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then(({ data }) => setProduct(data.product))
      .catch(() => navigate('/404'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (user && product) {
      const isWishlisted = user?.wishlist?.some((item) => {
        const itemId = item._id ? item._id.toString() : item.toString();
        return itemId === product._id.toString();
      });
      setWishlisted(isWishlisted);
    }
  }, [user, product]);

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    setWishlistLoading(true);
    try {
      await toggleWishlist(product._id);
      setWishlisted((prev) => !prev);
      await fetchUser();
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    } catch {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      await addReview(id, reviewForm);
      toast.success('Review submitted!');
      const { data } = await getProduct(id);
      setProduct(data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container spinner-page"><div className="spinner" /></div>;
  if (!product) return null;

  const price = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice : product.price;
  const discountPct = product.discountPrice && product.discountPrice < product.price
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div className="container product-detail-page">
      <div className="product-detail-grid">

        {/* Images */}
        <div className="product-images">
          <div className="product-card-img-wrap">
            <img
              src={product.images?.[selectedImg]?.url || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="product-main-img"
            />
            <button
              className={`card-heart-btn ${wishlisted ? 'wishlisted' : ''}`}
              onClick={handleWishlist}
              disabled={wishlistLoading}
              aria-label="Add to wishlist"
            >
              {wishlisted ? '❤️' : '🤍'}
            </button>
          </div>

          {product.images?.length > 1 && (
            <div className="product-thumbs">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt=""
                  className={`thumb ${selectedImg === i ? 'active' : ''}`}
                  onClick={() => setSelectedImg(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-info">
          <span className="product-brand">{product.brand}</span>
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating-row">
            <span className="stars">{'★'.repeat(Math.round(product.ratings))}{'☆'.repeat(5 - Math.round(product.ratings))}</span>
            <span className="rating-count">({product.numReviews} reviews)</span>
          </div>

          <div className="product-price-row">
            <span className="product-price">₹{price.toLocaleString()}</span>
            {discountPct > 0 && (
              <>
                <span className="product-price-original">₹{product.price.toLocaleString()}</span>
                <span className="product-discount-badge">{discountPct}% OFF</span>
              </>
            )}
          </div>

          <p className="product-description">{product.description}</p>

          {product.specifications?.length > 0 && (
            <div className="product-specs">
              <h4>Specifications</h4>
              <table>
                <tbody>
                  {product.specifications.map((s, i) => (
                    <tr key={i}>
                      <td>{s.key}</td>
                      <td>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="product-stock">
            Status: <strong className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
            </strong>
          </div>

          {product.stock > 0 && (
            <div className="product-qty-row">
              <label>Qty:</label>
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>
          )}

          <div className="product-actions">
            <button
              className="btn btn-primary"
              disabled={product.stock === 0}
              onClick={() => addToCart(product, qty)}
            >
              🛒 Add to Cart
            </button>
            <button
              className="btn btn-success"
              disabled={product.stock === 0}
              onClick={() => { addToCart(product, qty); navigate('/cart'); }}
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="reviews-section">
        <h2>Customer Reviews</h2>

        {user && (
          <form className="review-form" onSubmit={handleAddReview}>
            <h4>Write a Review</h4>
            <div className="form-group">
              <label>Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              >
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{'★'.repeat(r)} {r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={4}
                placeholder="Share your experience..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        <div className="reviews-list">
          {product.reviews?.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          ) : (
            product.reviews.map((r) => (
              <div key={r._id} className="review-card">
                <div className="review-header">
                  <strong>{r.name}</strong>
                  <span className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;