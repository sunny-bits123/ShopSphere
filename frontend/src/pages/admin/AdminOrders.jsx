// pages/admin/AdminOrders.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../../utils/api';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    getAllOrders({ limit: 50 }).then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  };

  useEffect(fetchOrders, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, { status });
      toast.success(`Status updated to ${status}`);
      fetchOrders();
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div className="container admin-page">
      <h1>Orders</h1>
      {loading ? <div className="spinner" /> : (
        <table className="admin-table">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td><Link to={`/orders/${o._id}`}>#{o._id.slice(-8).toUpperCase()}</Link></td>
                <td>{o.user?.name}</td>
                <td>₹{o.totalPrice?.toLocaleString()}</td>
                <td><span className={o.isPaid ? 'in-stock' : 'out-stock'}>{o.isPaid ? 'Paid' : 'Unpaid'}</span></td>
                <td>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    className="status-select"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
