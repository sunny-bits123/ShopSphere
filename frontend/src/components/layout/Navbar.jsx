import React, { useState ,useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const closeMenu = () => setMenuOpen(false);
  useEffect(() => {
  if (menuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => { document.body.style.overflow = ''; };
}, [menuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          🛒 <span>ShopSphere</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="navbar-links desktop-only">
          <Link to="/products">Products</Link>
          {user ? (
            <>
              <Link to="/orders">Orders</Link>
              <Link to="/wishlist">Wishlist</Link>
              {isAdmin && <Link to="/admin">Admin</Link>}
              <Link to="/profile">{user.name.split(' ')[0]}</Link>
              <button onClick={logout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-register">Sign Up</Link>
            </>
          )}
          <Link to="/cart" className="cart-icon">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu-overlay">
          <Link to="/products" onClick={closeMenu}>Products</Link>
          {user ? (
            <>
              <Link to="/orders" onClick={closeMenu}>Orders</Link>
              <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>
              {isAdmin && <Link to="/admin" onClick={closeMenu}>Admin</Link>}
              <Link to="/profile" onClick={closeMenu}>{user.name.split(' ')[0]}</Link>
              <button onClick={() => { logout(); closeMenu(); }} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="btn-register" onClick={closeMenu}>Sign Up</Link>
            </>
          )}
          <Link to="/cart" onClick={closeMenu}>🛒 Cart {cartCount > 0 && `(${cartCount})`}</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;