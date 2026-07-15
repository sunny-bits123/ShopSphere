// pages/WishlistPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toggleWishlist } from '../utils/api';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const { user, fetchUser } = useAuth();
  const { addToCart } = useCart();
  const wishlist = user?.wishlist || [];

  const handleRemove = async (productId) => {
    try {
      await toggleWishlist(productId);
      await fetchUser();
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Your wishlist is empty</h2>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My Wishlist ({wishlist.length})</h1>
      <div className="products-grid">
        {wishlist.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.images?.[0]?.url} alt={product.name} className="product-card-img" />
            <div className="product-card-body">
              <Link to={`/products/${product._id}`}><h3>{product.name}</h3></Link>
              <p>₹{product.price?.toLocaleString()}</p>
              <div className="product-actions" style={{ gap: '8px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>Add to Cart</button>
                <button className="btn btn-outline btn-sm" onClick={() => handleRemove(product._id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
