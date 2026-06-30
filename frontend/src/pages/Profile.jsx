import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();

        if (res.ok) {
          const list = Array.isArray(data) ? data : Array.isArray(data.orders) ? data.orders : [];
          setOrders(list);
        } else {
          if (res.status === 401) {
            logout();
            navigate('/login');
          }
          setOrders([]);
        }
      } catch (error) {
        console.error(error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusStyle = (status = 'pending') => {
    const normalized = String(status).toLowerCase();
    if (normalized === 'delivered') {
      return { background: 'rgba(16,185,129,0.14)', color: '#34d399' };
    }
    if (normalized === 'shipped') {
      return { background: 'rgba(59,130,246,0.14)', color: '#60a5fa' };
    }
    return { background: 'rgba(245,158,11,0.14)', color: '#fbbf24' };
  };

  const formatStatus = (status = 'pending') => String(status || 'pending').charAt(0).toUpperCase() + String(status || 'pending').slice(1);

  if (!user) return null;

  return (
    <div style={containerStyle}>
      <div style={heroCard}>
        <div>
          <p style={eyebrow}>Welcome back</p>
          <h2 style={title}>My Profile</h2>
          <p style={mutedText}><strong>Name:</strong> {user.name}</p>
          <p style={mutedText}><strong>Email:</strong> {user.email}</p>
          <span style={badgeStyle}>Account Type: {String(user.role || 'customer').toUpperCase()}</span>
        </div>
        <button onClick={handleLogout} style={logoutButton}>Logout</button>
      </div>

      <div style={ordersCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.3rem' }}>Order History</h3>
            <p style={{ margin: '4px 0 0', color: '#9ca3af' }}>Your recent purchases and delivery status</p>
          </div>
          <div style={{ background: 'rgba(249,115,22,0.16)', color: '#fb923c', padding: '8px 12px', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 700 }}>
            {orders.length} orders
          </div>
        </div>

        {loading ? (
          <div style={emptyState}>Fetching your orders...</div>
        ) : orders.length === 0 ? (
          <div style={emptyState}>
            <p style={{ marginBottom: '12px', color: '#d1d5db' }}>You haven't placed any orders yet.</p>
            <Link to="/shop" style={shopButton}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {orders.map(order => (
              <div key={order._id} style={orderCard}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.84rem' }}>Order ID: <span style={{ color: '#fff' }}>{order._id}</span></p>
                    <span style={{ ...statusChip, ...getStatusStyle(order.status) }}>{formatStatus(order.status)}</span>
                  </div>
                  <p style={{ margin: '4px 0', color: '#d4d4d8', fontSize: '0.95rem' }}>
                    Placed on <strong>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                  </p>
                  <p style={{ margin: '4px 0', color: '#d4d4d8', fontSize: '0.95rem' }}>
                    Items: <strong>{order.items?.length || 0}</strong> • Total: <strong style={{ color: '#34d399' }}>₹{Number(order.totalAmount || 0).toFixed(2)}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const containerStyle = {
  maxWidth: '1100px',
  margin: '40px auto',
  padding: '24px',
  color: '#f5f5f5'
};

const heroCard = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
  padding: '28px',
  borderRadius: '24px',
  background: 'linear-gradient(135deg, #111827 0%, #1f2937 55%, #111827 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
  marginBottom: '24px'
};

const ordersCard = {
  padding: '24px',
  borderRadius: '24px',
  background: '#111827',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 18px 40px rgba(0,0,0,0.2)'
};

const eyebrow = { margin: 0, color: '#fb923c', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' };
const title = { margin: '6px 0 10px', color: '#fff', fontSize: '2rem' };
const mutedText = { margin: '6px 0', color: '#cbd5e1', fontSize: '1rem' };
const badgeStyle = { background: 'rgba(249,115,22,0.16)', color: '#fb923c', padding: '8px 12px', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 700, display: 'inline-block' };
const logoutButton = { border: 'none', borderRadius: '999px', padding: '10px 16px', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 700 };
const emptyState = { background: 'rgba(255,255,255,0.03)', padding: '22px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' };
const shopButton = { display: 'inline-block', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: '999px', fontWeight: 700 };
const orderCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' };
const statusChip = { padding: '7px 11px', borderRadius: '999px', fontSize: '0.84rem', fontWeight: 700 };

export default Profile;