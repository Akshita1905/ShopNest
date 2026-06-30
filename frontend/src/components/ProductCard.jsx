import React from "react"
import {Link} from "react-router-dom"
import "../styles/product.css";

const ProductCard = ({ product })=>{
    return (
        <div className="product-card">
          <div className="product-image-wrap">
            <img src={product.imageUrl} alt={product.name} className="product-image"/>
          </div>
          <div className="product-info">
            <div>
              <p className="product-category">{product.category || 'Featured'}</p>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description?.slice(0, 70)}{product.description?.length > 70 ? '...' : ''}</p>
            </div>
            <div className="product-footer">
              <p className="product-price">₹{Number(product.price || 0).toFixed(2)}</p>
              <Link to={`/products/${product._id}`} className="view-details-button">
                View Details
              </Link>
            </div>
          </div>
        </div>
    );
};

export default ProductCard