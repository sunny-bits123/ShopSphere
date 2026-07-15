// pages/OrdersPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../utils/api';

const STATUS_COLOR = {
  pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6',
  delivered: '#10b981', cancelled: '#ef4444',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container spinner-page"><div className="spinner" /></div>;

  return (
    <div className="container orders-page">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <h3>No orders yet</h3>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="order-status" style={{ color: STATUS_COLOR[order.orderStatus] }}>
                  ● {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
              </div>
              <div className="order-items-preview">
                {order.orderItems.slice(0, 3).map((item) => (
                  <img key={item._id} src={item.image} alt={item.name} title={item.name} />
                ))}
                {order.orderItems.length > 3 && <span>+{order.orderItems.length - 3} more</span>}
              </div>
              <div className="order-card-footer">
                <span className="order-total">₹{order.totalPrice.toLocaleString()}</span>
                <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
