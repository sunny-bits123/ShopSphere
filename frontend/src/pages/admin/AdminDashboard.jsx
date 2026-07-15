// pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, getProducts, getAllUsers } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, users: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      getAllOrders({ limit: 5 }),
      getProducts({ limit: 1 }),
      getAllUsers(),
    ]).then(([ordersRes, productsRes, usersRes]) => {
      setStats({
        revenue: ordersRes.data.revenue || 0,
        orders: ordersRes.data.total,
        products: productsRes.data.total,
        users: usersRes.data.count,
      });
      setRecentOrders(ordersRes.data.orders);
    });
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: '💰', color: '#10b981' },
    { label: 'Total Orders', value: stats.orders, icon: '📦', color: '#3b82f6' },
    { label: 'Products', value: stats.products, icon: '🛍️', color: '#8b5cf6' },
    { label: 'Users', value: stats.users, icon: '👥', color: '#f59e0b' },
  ];

  return (
    <div className="container admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-nav-links">
          <Link to="/admin/products" className="btn btn-outline btn-sm">Products</Link>
          <Link to="/admin/orders" className="btn btn-outline btn-sm">Orders</Link>
          <Link to="/admin/users" className="btn btn-outline btn-sm">Users</Link>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((s) => (
          <div key={s.label} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
            <span className="stat-icon">{s.icon}</span>
            <div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="detail-card" style={{ marginTop: '2rem' }}>
        <h3>Recent Orders</h3>
        <table className="admin-table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o._id}>
                <td><Link to={`/orders/${o._id}`}>#{o._id.slice(-8).toUpperCase()}</Link></td>
                <td>{o.user?.name || 'N/A'}</td>
                <td>₹{o.totalPrice?.toLocaleString()}</td>
                <td><span className={`status-pill status-${o.orderStatus}`}>{o.orderStatus}</span></td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
