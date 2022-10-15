import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import ProductItem from '../utils/productItem/ProductItem';
import './productDetail.css';

// Created states within the ProductDetail function
function ProductDetail() {
  const params = useParams();
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const [productDetail, setProductDetail] = useState([]);

  /**
   * We use the useEffect hook to see if the param.id is true and has a value.
   * If the value exists, we update the productDetail variable.
   * First, we will use the forEach loop to loop through the products array to determine if the product and param id match.
   * If matched, we can use the productDetail which will update the product.
   * If the length of the productDetail array is 0, the result will return null
   */
  useEffect(() => {
    if (params.id) {
      products.forEach((product) => {
        if (product._id === params.id) setProductDetail(product);
      });
    }
  }, [params.id, products]);
  if (productDetail.length === 0) return null;

  // The structure of the Product Detail/View page is displayed below based on the functions we coded.
  return (
    <>
      <div className="detail">
        <img
          src={productDetail.images.url}
          alt=""
          className="productDetailImage"
        />
        <div className="box-detail">
          <div className="row">
            <h3 className="productDetailTitle">{productDetail.title}</h3>
            <p className="productDetailComponentID">
              #id: {productDetail.product_id}
            </p>
          </div>
          <span>R{productDetail.price}</span>
          <p>{productDetail.description}</p>
          <p>{productDetail.content}</p>
        </div>
      </div>
      <div>
        <h2 className="relatedProductsHeading">Related products</h2>
        <div className="products">
          {products.map((product) => {
            return product.category === productDetail.category ? (
              <ProductItem key={product._id} product={product} />
            ) : null;
          })}
        </div>
      </div>
    </>
  );
}

/* We export the 'ProductDetail' component in order to display this code in App.js. */
export default ProductDetail;
