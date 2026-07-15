import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toggleWishlist } from '../../utils/api';
import toast from 'react-hot-toast';

const StarRating = ({ rating }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();

  const isWishlisted = user?.wishlist?.some((item) => {
    const itemId = item._id ? item._id.toString() : item.toString();
    return itemId === product._id.toString();
  });

  const [wishlisted, setWishlisted] = useState(isWishlisted || false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const discount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = discount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  return (
    <div className="product-card">

      {/* Image + Heart Wrapper */}
      <div className="product-card-img-wrap">
        <Link to={`/products/${product._id}`} className="product-card-img-link">
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
          />
          {discount && <span className="discount-badge">-{discountPct}%</span>}
          {product.stock === 0 && <span className="out-of-stock-badge">Out of Stock</span>}
        </Link>

        {/* Heart — top right corner, outside Link */}
        <button
          className={`card-heart-btn ${wishlisted ? 'wishlisted' : ''}`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
          aria-label="Add to wishlist"
        >
          {wishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Product Info */}
      <div className="product-card-body">
        <span className="product-card-brand">{product.brand}</span>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-card-name">{product.name}</h3>
        </Link>
        <div className="product-card-rating">
          <StarRating rating={product.ratings} />
          <span className="review-count">({product.numReviews})</span>
        </div>
        <div className="product-card-price">
          <span className="price-current">
            ₹{(discount ? product.discountPrice : product.price).toLocaleString()}
          </span>
          {discount && (
            <span className="price-original">₹{product.price.toLocaleString()}</span>
          )}
        </div>
        <button
          className="btn btn-primary btn-add-cart"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;