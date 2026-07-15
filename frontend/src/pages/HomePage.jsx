import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../utils/api';
import ProductCard from '../components/product/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts({ isFeatured: true, limit: 8 }),
          getCategories(),
        ]);
        setFeaturedProducts(prodRes.data.products);
        setCategories(catRes.data.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">New Arrivals </span>
          <h1 className="hero-title">
            Shop Smarter,<br />Live Better
          </h1>
          <p className="hero-subtitle">
            Discover curated products across electronics, fashion, home & more.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now
            </Link>
            <Link to="/products?isFeatured=true" className="btn btn-outline btn-lg">
              View Featured
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat"><span>10K+</span><label>Products</label></div>
          <div className="stat"><span>50K+</span><label>Happy Customers</label></div>
          <div className="stat"><span>99%</span><label>Satisfaction</label></div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="category-card"
              >
                {cat.image?.url && (
                  <img src={cat.image.url} alt={cat.name} />
                )}
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products?isFeatured=true" className="see-all">
              See all →
            </Link>
          </div>
          {loading ? (
            <div className="products-skeleton">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust badges */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹499' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Razorpay / COD' },
              { icon: '↩️', title: 'Easy Returns', desc: '7-day return policy' },
              { icon: '⭐', title: '24/7 Support', desc: 'Chat & email support' },
            ].map((item) => (
              <div key={item.title} className="trust-card">
                <span className="trust-icon">{item.icon}</span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
