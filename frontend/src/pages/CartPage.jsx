// pages/CartPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal >= 499 ? 0 : 49;
  const tax = Math.round(cartTotal * 0.18);
  const grandTotal = cartTotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container empty-cart">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Shopping Cart ({cartItems.length} items)</h1>
      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.images?.[0]?.url} alt={item.name} />
              <div className="cart-item-info">
                <Link to={`/products/${item._id}`}><h3>{item.name}</h3></Link>
                <p>₹{(item.discountPrice || item.price).toLocaleString()}</p>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
              </div>
              <p className="cart-item-total">
                ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
              </p>
              <button className="remove-btn" onClick={() => removeFromCart(item._id)}>✕</button>
            </div>
          ))}
          <button onClick={clearCart} className="btn btn-outline btn-sm">Clear Cart</button>
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
          <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{grandTotal.toLocaleString()}</span></div>
          {shipping > 0 && <p className="free-ship-hint">Add ₹{499 - cartTotal} more for FREE shipping</p>}
          <button
            className="btn btn-primary btn-block"
            onClick={() => navigate(user ? '/checkout' : '/login?redirect=checkout')}
          >
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
