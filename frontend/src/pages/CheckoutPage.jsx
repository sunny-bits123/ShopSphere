import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, createRazorpayOrder, verifyPayment, updateOrderToPaid } from '../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];
  const [selectedAddress, setSelectedAddress] = useState(defaultAddress?._id || '');
  const [useNewAddress, setUseNewAddress] = useState(!defaultAddress);
  const [newAddress, setNewAddress] = useState({
    street: '', city: '', state: '', pincode: '', country: 'India', phone: '',
  });

  const shippingFee = cartTotal >= 499 ? 0 : 49;
  const tax = Math.round(cartTotal * 0.18);
  const grandTotal = cartTotal + shippingFee + tax;

  const getShippingAddress = () => {
    if (useNewAddress) return newAddress;
    const addr = user?.addresses?.find(a => a._id === selectedAddress);
    return {
      street: addr?.street,
      city: addr?.city,
      state: addr?.state,
      pincode: addr?.pincode,
      country: addr?.country || 'India',
      phone: addr?.phone,
    };
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const shippingAddress = getShippingAddress();
      const orderData = {
        orderItems: cartItems.map((i) => ({
          product: i._id,
          name: i.name,
          image: i.images?.[0]?.url || '',
          price: i.discountPrice || i.price,
          quantity: i.quantity,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: cartTotal,
        taxPrice: tax,
        shippingPrice: shippingFee,
        totalPrice: grandTotal,
      };

      if (paymentMethod === 'razorpay') {
        const { data: rzpData } = await createRazorpayOrder(grandTotal);
        const options = {
          key: rzpData.key,
          amount: rzpData.order.amount,
          currency: 'INR',
          name: 'ShopSphere',
          description: 'Secure Payment',
          order_id: rzpData.order.id,
          handler: async (response) => {
            try {
              // 1. Verify payment signature
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              // 2. Create order in database
              const { data } = await createOrder({
                ...orderData,
                paymentResult: {
                  id: response.razorpay_payment_id,
                  status: 'paid',
                  update_time: new Date().toISOString(),
                  email_address: user?.email,
                },
              });

              // 3. Mark order as paid → status becomes "processing"
              await updateOrderToPaid(data.order._id, {
                id: response.razorpay_payment_id,
                status: 'paid',
                update_time: new Date().toISOString(),
                email_address: user?.email,
              });

              clearCart();
              navigate(`/orders/${data.order._id}`);
              toast.success('Order placed & payment confirmed! 🎉');
            } catch (err) {
              toast.error('Payment received but order update failed. Contact support.');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: { color: '#6366f1' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const { data } = await createOrder(orderData);
        clearCart();
        navigate(`/orders/${data.order._id}`);
        toast.success('Order placed! 🎉');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>

      <div className="stepper">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i <= step ? 'active' : ''}`}>
            <span className="step-num">{i < step ? '✓' : i + 1}</span>
            <span className="step-label">{s}</span>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">

          {step === 0 && (
            <div className="checkout-section">
              <h3>Shipping Address</h3>
              {user?.addresses?.length > 0 && (
                <div className="saved-addresses">
                  <p className="saved-addr-label">Select a saved address:</p>
                  {user.addresses.map((addr) => (
                    <label key={addr._id} className={`address-radio ${selectedAddress === addr._id && !useNewAddress ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr._id && !useNewAddress}
                        onChange={() => { setSelectedAddress(addr._id); setUseNewAddress(false); }}
                      />
                      <div className="address-radio-content">
                        <div className="address-radio-header">
                          <span className="address-label">{addr.label}</span>
                          {addr.isDefault && <span className="address-default-badge">✓ Default</span>}
                        </div>
                        <p>{addr.street}, {addr.city}</p>
                        <p>{addr.state} — {addr.pincode}</p>
                        <p>📞 {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                  <label className={`address-radio ${useNewAddress ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="address"
                      checked={useNewAddress}
                      onChange={() => setUseNewAddress(true)}
                    />
                    <div className="address-radio-content">
                      <span className="address-label">+ Use a different address</span>
                    </div>
                  </label>
                </div>
              )}

              {(useNewAddress || user?.addresses?.length === 0) && (
                <div className="new-address-form">
                  {['street', 'city', 'state', 'pincode', 'phone'].map((field) => (
                    <div className="form-group" key={field}>
                      <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input
                        type={field === 'phone' ? 'tel' : 'text'}
                        value={newAddress[field]}
                        onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                        placeholder={`Enter ${field}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                className="btn btn-primary"
                onClick={() => setStep(1)}
                disabled={useNewAddress && (!newAddress.street || !newAddress.city || !newAddress.phone)}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="checkout-section">
              <h3>Payment Method</h3>
              {[
                { value: 'cod', label: '💵 Cash on Delivery' },
                { value: 'razorpay', label: '💳 Razorpay (Cards / UPI / Wallets)' },
              ].map((m) => (
                <label key={m.value} className={`radio-option ${paymentMethod === m.value ? 'radio-option--selected' : ''}`}>
                  <input type="radio" value={m.value} checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} />
                  {m.label}
                </label>
              ))}
              <div className="btn-row">
                <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Review Order →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-section">
              <h3>Review Your Order</h3>
              {cartItems.map((item) => (
                <div key={item._id} className="review-item">
                  <img src={item.images?.[0]?.url} alt={item.name} />
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="review-address">
                <h4>Delivering to:</h4>
                {(() => {
                  const addr = useNewAddress
                    ? newAddress
                    : user?.addresses?.find(a => a._id === selectedAddress);
                  return addr ? (
                    <p>{addr.street}, {addr.city}, {addr.state} — {addr.pincode}</p>
                  ) : null;
                })()}
              </div>
              <div className="btn-row">
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-success" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Placing...' : '✅ Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span></div>
          <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{grandTotal.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;