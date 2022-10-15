import React from 'react';
import BtnRender from '../productItem/BtnRender';
import './productItem.css';

// Created a ProductItem function to display each product by making use of props.
function ProductItem({ product, isAdmin, deleteProduct, handleCheck }) {
  return (
    <div className="product_card">
      {isAdmin && (
        <input
          className="checkbox"
          type="checkbox"
          checked={product.checked}
          onChange={() => handleCheck(product._id)}
        />
      )}
      <img
        src={product.images.url}
        alt=""
        width="100"
        height="100"
        style={{ objectFit: 'cover' }}
      />
      <div className="product_box">
        <h3 title={product.title}>{product.title}</h3>
        <span>R{product.price}</span>
        <p className="productItemComponentDescription">{product.description}</p>
      </div>

      <BtnRender product={product} deleteProduct={deleteProduct} />
    </div>
  );
}

/* We export the 'ProductItem' component in order to display this code in App.js. */
export default ProductItem;
