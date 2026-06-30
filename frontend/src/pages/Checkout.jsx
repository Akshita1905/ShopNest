import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', postalCode: '', country: ''
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const saveOrder = async (paymentId) => {
    const saveOrderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        items: cartItems,
        totalAmount: totalPrice,
        address,
        paymentId
      })
    });

    if (saveOrderRes.ok) {
      dispatch(clearCart());
      navigate('/ordersuccess');
      return true;
    }

    alert('Order could not be saved. Please try again.');
    return false;
  };

  const bypassPayment = async () => {
    setIsPlacingOrder(true);
    await saveOrder(`bypass_txn_${Date.now()}`);
    setIsPlacingOrder(false);
  };

  const handlePayment = async () => {
    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice })
      });

      if (!orderRes.ok) {
        const shouldUseBypass = window.confirm('Razorpay is not available right now. Use Student Bypass Mode to place a test order?');
        if (shouldUseBypass) {
          await bypassPayment();
        } else {
          alert('Payment could not be initialized.');
        }
        return;
      }

      const orderData = await orderRes.json();
      const options = {
        key: orderData.key_id || 'rzp_test_dummykey123',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShopNest',
        description: 'Test Transaction',
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });

          if (verifyRes.ok) {
            await saveOrder(response.razorpay_payment_id);
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: '9999999999'
        },
        theme: {
          color: '#f97316'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert('Payment could not be completed.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePayment();
  };

  return (
    <div style={pageWrapper}>
      <div style={heroCard}>
        <div>
          <p style={eyebrow}>Secure checkout</p>
          <h2 style={title}>Checkout</h2>
          <p style={subtitle}>Complete your order with a fast, polished experience.</p>
        </div>
        <div style={summaryBadge}>₹{totalPrice.toFixed(2)}</div>
      </div>

      <div style={contentGrid}>
        <form onSubmit={handleSubmit} style={formCard}>
          <h3 style={sectionTitle}>Shipping Address</h3>
          <input style={inputStyle} type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
          <input style={inputStyle} type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
          <input style={inputStyle} type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
          <input style={inputStyle} type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
          <input style={inputStyle} type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />

          <div style={paymentBox}>
            <div>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.95rem' }}>Total to pay</p>
              <h4 style={{ margin: '6px 0 0', color: '#fff', fontSize: '1.8rem' }}>₹{totalPrice.toFixed(2)}</h4>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="submit" style={payButton} disabled={isPlacingOrder}>
                {isPlacingOrder ? 'Processing...' : 'Pay Now'}
              </button>
              <button type="button" onClick={bypassPayment} style={bypassButton} disabled={isPlacingOrder}>
                {isPlacingOrder ? 'Processing...' : 'Student Bypass'}
              </button>
            </div>
          </div>
        </form>

        <div style={orderCard}>
          <h3 style={sectionTitle}>Your Order</h3>
          {cartItems.length === 0 ? (
            <p style={{ color: '#cbd5e1' }}>Your cart is empty.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {cartItems.map((item) => (
                <div key={item._id || item.productId} style={itemRow}>
                  <div>
                    <p style={{ margin: 0, color: '#fff', fontWeight: 700 }}>{item.name}</p>
                    <p style={{ margin: '4px 0 0', color: '#9ca3af' }}>Qty: {item.qty}</p>
                  </div>
                  <p style={{ margin: 0, color: '#fb923c', fontWeight: 700 }}>₹{(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
          <div style={divider} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#cbd5e1' }}>Subtotal</span>
            <strong style={{ color: '#fff' }}>₹{totalPrice.toFixed(2)}</strong>
          </div>
          <div style={{ marginTop: '10px', color: '#9ca3af', fontSize: '0.95rem' }}>
            Student bypass is available when Razorpay is not configured.
          </div>
        </div>
      </div>
    </div>
  );
};

const pageWrapper = { maxWidth: '1200px', margin: '36px auto', padding: '24px', color: '#f5f5f5' };
const heroCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '24px', borderRadius: '24px', background: 'linear-gradient(135deg, #111827 0%, #1f2937 55%, #111827 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 45px rgba(0,0,0,0.25)', marginBottom: '20px' };
const eyebrow = { margin: 0, color: '#fb923c', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' };
const title = { margin: '6px 0 8px', fontSize: '1.8rem', color: '#fff' };
const subtitle = { margin: 0, color: '#cbd5e1' };
const summaryBadge = { background: 'rgba(249,115,22,0.16)', color: '#fb923c', padding: '10px 14px', borderRadius: '999px', fontWeight: 700 };
const contentGrid = { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' };
const formCard = { background: '#111827', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 36px rgba(0,0,0,0.2)' };
const sectionTitle = { marginTop: 0, marginBottom: '16px', color: '#fff', fontSize: '1.2rem' };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '14px 16px', marginBottom: '12px', background: '#1f2937', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', outline: 'none' };
const paymentBox = { marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' };
const payButton = { border: 'none', padding: '12px 18px', borderRadius: '999px', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', fontWeight: 700, cursor: 'pointer' };
const bypassButton = { border: '1px solid rgba(59,130,246,0.35)', padding: '12px 18px', borderRadius: '999px', background: 'rgba(59,130,246,0.14)', color: '#60a5fa', fontWeight: 700, cursor: 'pointer' };
const orderCard = { background: '#111827', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 36px rgba(0,0,0,0.2)', height: 'fit-content' };
const itemRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' };
const divider = { height: '1px', background: 'rgba(255,255,255,0.08)', margin: '16px 0' };

export default Checkout;