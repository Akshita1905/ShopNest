import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={pageWrapper}>
      <section style={heroCard}>
        <div style={{ flex: 1 }}>
          <p style={eyebrow}>New season, fresh picks</p>
          <h1 style={heroTitle}>Welcome to ShopNest</h1>
          <p style={heroText}>Discover premium essentials, everyday favorites, and handpicked deals curated for modern living.</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
            <Link to="/shop" style={primaryButton}>Shop Now</Link>
            <Link to="/about" style={secondaryButton}>Learn More</Link>
          </div>
        </div>
        <div style={heroStats}>
          <div style={statBox}>
            <strong style={{ fontSize: '1.4rem' }}>24/7</strong>
            <span style={{ color: '#9ca3af' }}>Support</span>
          </div>
          <div style={statBox}>
            <strong style={{ fontSize: '1.4rem' }}>Fast</strong>
            <span style={{ color: '#9ca3af' }}>Delivery</span>
          </div>
          <div style={statBox}>
            <strong style={{ fontSize: '1.4rem' }}>Top</strong>
            <span style={{ color: '#9ca3af' }}>Rated</span>
          </div>
        </div>
      </section>

      <section style={featureStrip}>
        <div style={featureBox}>🚚 Free shipping on orders above ₹999</div>
        <div style={featureBox}>💳 Secure checkout with student bypass</div>
        <div style={featureBox}>⭐ Trusted by shoppers worldwide</div>
      </section>

      <section style={{ marginTop: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.7rem' }}>Featured Products</h2>
          <Link to="/shop" style={{ color: '#fb923c', fontWeight: 700 }}>View all</Link>
        </div>

        {loading ? (
          <div style={loadingBox}>Loading featured products...</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const pageWrapper = { maxWidth: '1280px', margin: '0 auto', padding: '24px 0 40px' };
const heroCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', padding: '32px', background: 'linear-gradient(135deg, #111827 0%, #1f2937 55%, #111827 100%)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 45px rgba(0,0,0,0.25)' };
const eyebrow = { margin: 0, color: '#fb923c', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' };
const heroTitle = { margin: '8px 0 10px', color: '#fff', fontSize: '2.4rem', lineHeight: 1.1 };
const heroText = { margin: 0, color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '620px' };
const primaryButton = { background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', padding: '12px 18px', borderRadius: '999px', fontWeight: 700 };
const secondaryButton = { border: '1px solid rgba(255,255,255,0.16)', color: '#fff', padding: '12px 18px', borderRadius: '999px', fontWeight: 700 };
const heroStats = { display: 'grid', gap: '12px', minWidth: '220px' };
const statBox = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '4px' };
const featureStrip = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginTop: '20px' };
const featureBox = { background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '14px 16px', color: '#e5e7eb', textAlign: 'center' };
const loadingBox = { background: '#111827', borderRadius: '16px', padding: '20px', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)' };

export default Home;