import React from 'react';

const TermsPage = () => {
  return (
    <div className="container static-page legal-page">
      <h1>Terms & Conditions</h1>
      <p className="page-subtitle">Last updated: June 2026</p>

      <section className="static-section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using ShopSphere, you agree to be bound by these Terms
          and Conditions. If you do not agree, please do not use our platform.
        </p>
      </section>

      <section className="static-section">
        <h2>2. Account Responsibility</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account
          credentials. Any activity under your account is your responsibility.
        </p>
      </section>

      <section className="static-section">
        <h2>3. Orders & Payments</h2>
        <ul>
          <li>All prices are listed in Indian Rupees (₹) and include applicable taxes</li>
          <li>We reserve the right to cancel orders due to stock unavailability or pricing errors</li>
          <li>Payment must be completed before order processing (except COD)</li>
        </ul>
      </section>

      <section className="static-section">
        <h2>4. Cancellations</h2>
        <p>
          Orders can be cancelled only while in "Pending" or "Processing" status.
          Once an order is shipped, cancellation is not possible.
        </p>
      </section>

      <section className="static-section">
        <h2>5. Product Information</h2>
        <p>
          We strive to display accurate product descriptions and images. Minor
          variations in color or packaging may occur due to manufacturer updates.
        </p>
      </section>

      <section className="static-section">
        <h2>6. Limitation of Liability</h2>
        <p>
          ShopSphere is not liable for indirect damages arising from the use of our
          platform, including delays caused by third-party delivery partners.
        </p>
      </section>

      <section className="static-section">
        <h2>7. Changes to Terms</h2>
        <p>
          We may update these terms periodically. Continued use of the platform
          constitutes acceptance of the revised terms.
        </p>
      </section>
    </div>
  );
};

export default TermsPage;