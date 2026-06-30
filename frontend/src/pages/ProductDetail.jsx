import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import '../styles/product.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        qty: 1
      }));
      alert('Successfully added to your cart!');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', margin: '100px', color: '#f97316' }}>Loading Product...</div>;
  if (!product) return <div style={{ textAlign: 'center', margin: '100px', color: '#ef4444' }}>Product Not Found</div>;

  return (
    <div className="product-detail-wrapper" style={{ maxWidth: '1250px', margin: '0 auto', padding: '24px' }}>
      <div style={{ color: '#a1a1aa', marginBottom: '20px', fontSize: '0.95rem' }}>
        <Link to="/" style={{ color: '#f97316' }}>Home</Link> / <Link to="/shop" style={{ color: '#f97316' }}>Shop</Link> / {product.category} / <span style={{ color: '#fff' }}>{product.name}</span>
      </div>

      <div className="product-detail">
        <div className="detail-image-container">
          <img src={product.imageUrl} alt={product.name} className="detail-image" />
        </div>

        <div className="detail-info">
          <p style={{ margin: 0, color: '#fb923c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem' }}>{product.category}</p>
          <h2 style={{ fontSize: '2.4rem', margin: '8px 0 10px' }}>{product.name}</h2>
          <p className="detail-price">₹{Number(product.price || 0).toFixed(2)}</p>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: '#fff', marginBottom: '10px' }}>Product Description</h4>
            <p style={{ color: '#cbd5e1', lineHeight: '1.8', margin: 0 }}>{product.description}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={handleAddToCart} className="btn" style={{ flexGrow: '1', padding: '16px 18px', fontSize: '1.05rem' }}>
              Add to Cart
            </button>
            <Link to="/shop" style={{ color: '#fb923c', fontWeight: 700 }}>Continue Shopping</Link>
          </div>

          <div style={{ marginTop: '20px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ margin: 0, color: product.stock > 0 ? '#34d399' : '#ef4444', fontWeight: '600' }}>
              {product.stock > 0 ? `● In Stock (${product.stock} units available)` : '● Temporarily Out of Stock'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;