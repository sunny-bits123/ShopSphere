import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="container static-page">
      <h1>About ShopSphere</h1>
      <p className="page-subtitle">Your trusted destination for quality products since 2024</p>

      <section className="static-section">
        <h2>Our Story</h2>
        <p>
          ShopSphere was founded with a simple mission: to make online shopping
          accessible, affordable, and enjoyable for everyone. What started as a
          small college project has grown into a platform serving thousands of
          customers across electronics, fashion, books, and home essentials.
        </p>
      </section>

      <section className="static-section">
        <h2>What We Offer</h2>
        <div className="about-grid">
          <div className="about-card">
            <span className="about-icon">🛍️</span>
            <h3>Wide Selection</h3>
            <p>Thousands of products across multiple categories, curated for quality.</p>
          </div>
          <div className="about-card">
            <span className="about-icon">🚚</span>
            <h3>Fast Delivery</h3>
            <p>Quick and reliable shipping with free delivery on orders above ₹499.</p>
          </div>
          <div className="about-card">
            <span className="about-icon">🔒</span>
            <h3>Secure Payments</h3>
            <p>Multiple payment options including Razorpay and Cash on Delivery.</p>
          </div>
          <div className="about-card">
            <span className="about-icon">↩️</span>
            <h3>Easy Returns</h3>
            <p>Hassle-free 7-day return policy on eligible items.</p>
          </div>
        </div>
      </section>

      <section className="static-section">
        <h2>Our Mission</h2>
        <p>
          We believe shopping online should be simple, transparent, and trustworthy.
          Every feature we build — from saved addresses to order tracking — is designed
          with our customers' convenience in mind.
        </p>
      </section>

      <section className="static-section static-cta">
        <h2>Have Questions?</h2>
        <p>We'd love to hear from you. Reach out to our support team anytime.</p>
        <Link to="/contact" className="btn btn-primary">Contact Us</Link>
      </section>
    </div>
  );
};

export default AboutPage;