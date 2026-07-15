import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending — replace with real API call when backend email is set up
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="container static-page">
      <h1>Contact Us</h1>
      <p className="page-subtitle">We're here to help. Reach out anytime.</p>

      <div className="contact-layout">
        <div className="contact-info">
          <div className="contact-card">
            <span className="contact-icon">📧</span>
            <h3>Email Us</h3>
            <p>support@shopsphere.com</p>
            <p className="contact-hint">We reply within 24 hours</p>
          </div>
          <div className="contact-card">
            <span className="contact-icon">📞</span>
            <h3>Call Us</h3>
            <p>+91 96954 57219</p>
            <p className="contact-hint">Mon–Sat, 9 AM – 7 PM</p>
          </div>
          <div className="contact-card">
            <span className="contact-icon">📍</span>
            <h3>Visit Us</h3>
            <p>Gorakhpur, Uttar Pradesh, India</p>
            <p className="contact-hint">By appointment only</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send us a message</h3>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Your Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Order issue, feedback, etc."
              required
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us how we can help..."
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={sending}>
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;