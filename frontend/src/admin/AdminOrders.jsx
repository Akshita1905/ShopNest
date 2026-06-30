import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        const list = Array.isArray(data) ? data : Array.isArray(data.orders) ? data.orders : [];
        setOrders(list);
        setError(res.ok ? '' : data.message || 'Unable to load orders');
      } catch (err) {
        setError('Unable to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status: status.toLowerCase() })
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(prev => prev.map(order => order._id === id ? { ...order, status: status.toLowerCase() } : order));
        setError('');
      } else {
        setError(data.message || 'Failed to update order status');
      }
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const formatStatus = (status = 'pending') => String(status || 'pending').charAt(0).toUpperCase() + String(status || 'pending').slice(1);
  const getStatusStyle = (status = 'pending') => {
    const normalized = String(status).toLowerCase();
    if (normalized === 'delivered') return { background: 'rgba(16,185,129,0.14)', color: '#34d399' };
    if (normalized === 'shipped') return { background: 'rgba(59,130,246,0.14)', color: '#60a5fa' };
    return { background: 'rgba(245,158,11,0.14)', color: '#fbbf24' };
  };

  return (
    <div style={containerStyle}>
      <div style={heroCard}>
        <div>
          <p style={eyebrow}>Admin workspace</p>
          <h2 style={{ margin: '6px 0', color: '#fff', fontSize: '1.8rem' }}>Manage Orders</h2>
          <p style={{ margin: 0, color: '#cbd5e1' }}>Track customer orders and update delivery status quickly.</p>
        </div>
        <div style={{ background: 'rgba(249,115,22,0.16)', color: '#fb923c', padding: '10px 14px', borderRadius: '999px', fontWeight: 700 }}>
          {orders.length} orders
        </div>
      </div>

      {error ? <div style={errorBox}>{error}</div> : null}

      <div style={{ overflowX: 'auto', background: '#111827', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 18px 40px rgba(0,0,0,0.2)' }}>
        {loading ? (
          <div style={{ padding: '24px', color: '#cbd5e1' }}>Loading orders...</div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={rowStyle}>
                <th style={thStyle}>ORDER ID</th>
                <th style={thStyle}>USER</th>
                <th style={thStyle}>TOTAL</th>
                <th style={thStyle}>DATE</th>
                <th style={thStyle}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} style={rowStyle}>
                  <td style={tdStyle}>{order._id ? `${order._id.substring(0, 8)}...` : 'N/A'}</td>
                  <td style={tdStyle}>{order.user?.name || 'Deleted User'}</td>
                  <td style={tdStyle}>₹{Number(order.totalAmount || 0).toFixed(2)}</td>
                  <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ ...statusChip, ...getStatusStyle(order.status) }}>{formatStatus(order.status)}</span>
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        style={{ background: '#1f2937', color: '#fff', padding: '8px 10px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', outline: 'none' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const containerStyle = { maxWidth: '1200px', margin: '40px auto', padding: '24px', color: '#f5f5f5' };
const heroCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '24px', borderRadius: '24px', background: 'linear-gradient(135deg, #111827 0%, #1f2937 55%, #111827 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 45px rgba(0,0,0,0.25)', marginBottom: '18px' };
const eyebrow = { margin: 0, color: '#fb923c', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const rowStyle = { borderBottom: '1px solid rgba(255,255,255,0.08)' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#9ca3af', fontSize: '0.9rem' };
const tdStyle = { padding: '15px', textAlign: 'left', color: '#e5e7eb' };
const errorBox = { marginBottom: '14px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(239,68,68,0.14)', color: '#fecaca', border: '1px solid rgba(239,68,68,0.25)' };
const statusChip = { padding: '7px 10px', borderRadius: '999px', fontSize: '0.84rem', fontWeight: 700 };

export default AdminOrders;