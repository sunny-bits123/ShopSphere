import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="container not-found-page">
    <div className="not-found-content">
      <h1 className="not-found-code">404</h1>
      <h2>Page Not Found</h2>
      <p>Looks like this page went out of stock.</p>
      <Link to="/" className="btn btn-primary btn-lg">Back to Home</Link>
    </div>
  </div>
);

export default NotFoundPage;
