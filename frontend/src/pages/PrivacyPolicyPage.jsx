import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="container static-page legal-page">
      <h1>Privacy Policy</h1>
      <p className="page-subtitle">Last updated: June 2026</p>

      <section className="static-section">
        <h2>1. Information We Collect</h2>
        <p>
          When you create an account or place an order on ShopSphere, we collect:
        </p>
        <ul>
          <li>Personal details: name, email address, phone number</li>
          <li>Shipping addresses you save to your account</li>
          <li>Order history and payment status (we do not store card details)</li>
          <li>Product reviews and ratings you submit</li>
        </ul>
      </section>

      <section className="static-section">
        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To process and deliver your orders</li>
          <li>To send order confirmations and shipping updates</li>
          <li>To provide customer support</li>
          <li>To improve our products and services</li>
        </ul>
      </section>

      <section className="static-section">
        <h2>3. Data Security</h2>
        <p>
          We use industry-standard encryption to protect your data. Passwords are
          hashed using bcrypt and never stored in plain text. Payment processing is
          handled securely through Razorpay, and we do not store your card or UPI details.
        </p>
      </section>

      <section className="static-section">
        <h2>4. Cookies</h2>
        <p>
          We use cookies to keep you logged in and remember your cart items. You can
          disable cookies in your browser settings, but some features may not work properly.
        </p>
      </section>

      <section className="static-section">
        <h2>5. Third-Party Sharing</h2>
        <p>
          We do not sell your personal data. We may share order details with delivery
          partners solely for the purpose of fulfilling your order.
        </p>
      </section>

      <section className="static-section">
        <h2>6. Your Rights</h2>
        <p>
          You can update or delete your account information anytime from your Profile
          page. You may also request complete account deletion by contacting our support team.
        </p>
      </section>

      <section className="static-section">
        <h2>7. Contact Us</h2>
        <p>
          For any privacy-related concerns, reach out to us at support@shopsphere.com.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;