// components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <h3>🛒 ShopSphere</h3>
        <p>Your one-stop shop for everything.</p>
      </div>
      <div className="footer-links">
        <h4>Shop</h4>
        <Link to="/products">All Products</Link>
        <Link to="/products?isFeatured=true">Featured</Link>
      </div>
      <div className="footer-links">
        <h4>Account</h4>
        <Link to="/profile">Profile</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/wishlist">Wishlist</Link>
      </div>
      <div className="footer-links">
        <h4>Info</h4>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms & Conditions</Link>
        <Link to="/returns">Returns & Refunds</Link>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} ShopSphere. Built with MERN Stack.</p>
    </div>
  </footer>
);

export default Footer;
