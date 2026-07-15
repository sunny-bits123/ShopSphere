import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder, updateOrderStatus } from '../utils/api';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    getOrder(id).then(({ data }) => setOrder(data.order)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const { data } = await updateOrderStatus(id, {
        status: 'cancelled',
        note: 'Cancelled by customer',
      });
      setOrder(data.order);
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="container spinner-page"><div className="spinner" /></div>;
  if (!order) return <div className="container"><h2>Order not found</h2></div>;

  const canCancel = ['pending', 'processing'].includes(order.orderStatus);

  return (
    <div className="container order-detail-page">
      <Link to="/orders" className="back-link">← Back to Orders</Link>

      <div className="order-detail-header">
        <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
        <span className={`order-badge status-${order.orderStatus}`}>
          ● {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
        </span>

        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="btn btn-danger btn-sm"
          >
            {cancelling ? 'Cancelling...' : '✕ Cancel Order'}
          </button>
        )}

        {order.orderStatus === 'cancelled' && (
          <span className="order-cancelled-note">✕ This order has been cancelled</span>
        )}

        {order.orderStatus === 'shipped' && (
          <span className="order-shipped-note">🚚 Already shipped — cannot cancel</span>
        )}

        {order.orderStatus === 'delivered' && (
          <span className="order-delivered-note">✅ Order delivered</span>
        )}
      </div>

      <div className="order-detail-grid">
        <div>
          <div className="detail-card">
            <h3>Items Ordered</h3>
            {order.orderItems.map((item) => (
              <div key={item._id} className="order-item-row">
                <img src={item.image} alt={item.name} />
                <div>
                  <Link to={`/products/${item.product}`}>{item.name}</Link>
                  <p>₹{item.price.toLocaleString()} × {item.quantity}</p>
                </div>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="detail-card">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
            <p>{order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
            <p>📞 {order.shippingAddress.phone}</p>
          </div>
        </div>

        <div>
          <div className="detail-card">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{order.itemsPrice?.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
            <div className="summary-row"><span>Tax</span><span>₹{order.taxPrice?.toLocaleString()}</span></div>
            <div className="summary-row total"><span>Total</span><span>₹{order.totalPrice?.toLocaleString()}</span></div>
          </div>

          <div className="detail-card">
            <h3>Payment</h3>
            <p>Method: <strong>{order.paymentMethod?.toUpperCase()}</strong></p>
            <p>Status: <strong className={order.isPaid ? 'in-stock' : 'out-stock'}>
              {order.isPaid ? '✅ Paid' : '⏳ Pending'}
            </strong></p>
          </div>

          <div className="detail-card">
            <h3>Order Timeline</h3>
            {order.statusHistory?.map((h, i) => (
              <div key={i} className="timeline-item">
                <span className={`timeline-dot ${h.status === 'cancelled' ? 'timeline-dot--cancelled' : ''}`} />
                <div>
                  <strong className={h.status === 'cancelled' ? 'out-stock' : ''}>
                    {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                  </strong>
                  <p>{new Date(h.timestamp).toLocaleString()}</p>
                  {h.note && <p className="timeline-note">{h.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;