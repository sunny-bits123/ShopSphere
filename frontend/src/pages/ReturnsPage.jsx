import React from 'react';
import { Link } from 'react-router-dom';

const ReturnsPage = () => {
  return (
    <div className="container static-page">
      <h1>Returns & Refunds</h1>
      <p className="page-subtitle">Easy 7-day return policy on eligible items</p>

      <section className="static-section">
        <h2>Return Eligibility</h2>
        <div className="about-grid">
          <div className="about-card">
            <span className="about-icon">📅</span>
            <h3>7-Day Window</h3>
            <p>Returns must be initiated within 7 days of delivery.</p>
          </div>
          <div className="about-card">
            <span className="about-icon">📦</span>
            <h3>Original Condition</h3>
            <p>Items must be unused, with original tags and packaging intact.</p>
          </div>
          <div className="about-card">
            <span className="about-icon">🧾</span>
            <h3>Proof of Purchase</h3>
            <p>Order ID and proof of purchase are required for all returns.</p>
          </div>
          <div className="about-card">
            <span className="about-icon">💰</span>
            <h3>Refund Timeline</h3>
            <p>Refunds are processed within 5-7 business days after pickup.</p>
          </div>
        </div>
      </section>

      <section className="static-section">
        <h2>How to Return an Item</h2>
        <ol className="steps-list">
          <li>Go to <strong>My Orders</strong> and select the order you want to return</li>
          <li>Click <strong>Request Return</strong> and select a reason</li>
          <li>Our team will arrange a pickup within 2-3 business days</li>
          <li>Once received and inspected, your refund will be processed</li>
        </ol>
      </section>

      <section className="static-section">
        <h2>Non-Returnable Items</h2>
        <ul>
          <li>Personal care and hygiene products</li>
          <li>Innerwear and intimate apparel</li>
          <li>Perishable goods</li>
          <li>Items marked as "Final Sale"</li>
        </ul>
      </section>

      <section className="static-section static-cta">
        <h2>Need Help with a Return?</h2>
        <p>Our support team is here to assist you with any return-related questions.</p>
        <Link to="/contact" className="btn btn-primary">Contact Support</Link>
      </section>
    </div>
  );
};

export default ReturnsPage;