import React, { useContext, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import ProductItem from '../utils/productItem/ProductItem';
import Loading from '../utils/loading/Loading';
import axios from 'axios';
import Filters from './Filters';
import LoadMore from './LoadMore';
import './products.css';

// Created states within the Products function
function Products() {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  /**
   * A forEach loop will loop through the products to see if the product._id value matches the 'id' which is parsed against the function.
   * If matched, then the product will be checked and the state will be updated.
   */
  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });

    setProducts([...products]);
  };

  /**
   * A deleteProduct function is created in order to delete/remove the product.
   * A POST request is made which will identify the public_id key value in order to delete the image.
   * Another variable is created in order to process the product removal.
   * An authorization token is passed in the header to protect user information.
   * Lastly, we update the state of the product.
   */
  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      const destroyImg = await axios.post(
        '/api/destroy',
        { public_id },
        {
          headers: { Authorization: token },
        }
      );
      const deleteProduct = await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });
      await destroyImg;
      await deleteProduct;
      setCallback(!callback);
      setLoading(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  /* Created a CheckAll function for the admin member to select all products. */
  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  /* Created a deleteAll function for the admin member to delete all products. */
  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
  };

  /* If the loading variable is true, the Loading component will be returned displaying the loader when loading the content. */
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  // The structure of the Products page is displayed below based on the functions we coded.
  return (
    <>
      <Filters />
      {isAdmin && (
        <div className="delete-all">
          <span>Select all</span>
          <input type="checkbox" checked={isCheck} onChange={checkAll} />
          <button onClick={deleteAll}>Delete all</button>
        </div>
      )}
      <div className="products">
        {products.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
      </div>
      <LoadMore />
      {products.length === 0 && <Loading />}
    </>
  );
}

/* We export the 'Products' component in order to display this code in App.js. */
export default Products;
