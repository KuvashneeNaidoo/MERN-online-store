import React, { useContext, useState, useEffect } from 'react';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import './cart.css';

// Created states within the Cart function
function Cart() {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [total, setTotal] = useState(0);
  const [token] = state.token;

  /**
   * We will use the useEffect hook to get the total price of the products in the cart.
   * The reduce method will pass the value of the previous calculation which will then be returned.
   * The state will be updates and the getTotal function will be called.
   */
  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);
      setTotal(total);
    };
    getTotal();
  }, [cart]);

  /**
   * A patch request is made to modify the cart data by adding a new product to the cart
   * An authorization token is passed in the header to protect user information.
   */
  const addingNewProductToCart = async (cart) => {
    await axios.patch(
      '/user/addcart',
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };

  /**
   * The increaseProductQuantityCreating function will increase the quantity of a product in their cart by 1 each time.
   * A forEach loop will loop through the items to see if the item._id value matches the 'id' which is parsed against the function.
   * If matched, then the product quantity will increase by 1.
   */
  const increaseProductQuantity = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });

    setCart([...cart]);
    addingNewProductToCart(cart);
  };

  /**
   * The decreaseProductQuantity function will decrease the quantity of a product in their cart by 1 each time.
   * A forEach loop will loop through the items to see if the item._id value matches the 'id' which is parsed against the function.
   * If matched, then the product quantity will decrease by 1 until only 1 product is left in the cart.
   */
  const decreaseProductQuantity = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });
    setCart([...cart]);
    addingNewProductToCart(cart);
  };

  /**
   * The deleteProductFromCart function will allow the user to delete the item from their cart by clicking on the red X.
   * A forEach loop will loop through the items to see if the item._id value matches the 'id' which is parsed against the function.
   * If matched, the splice method will delete the item from the cart.
   */
  const deleteProductFromCart = (id) => {
    if (
      window.confirm(
        'Are you sure you want to remove this product from your cart?'
      )
    ) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });
      setCart([...cart]);
      addingNewProductToCart(cart);
    }
  };

  /**
   * Creating the Cart page which will display the product's id, image, title, price, quantity, description, content, and total cost.
   * A paypal button is displayed on the page for visual purposes and is not functional at the moment.
   */
  return (
    <div>
      {cart.map((product) => (
        <div className="detail cart" key={product._id}>
          <img src={product.images.url} alt="" />

          <div className="box-detail">
            <h2>{product.title}</h2>

            <h3>R{product.price * product.quantity}</h3>
            <p>{product.description}</p>
            <p>{product.content}</p>

            <div className="amount">
              <button onClick={() => decreaseProductQuantity(product._id)}>
                {' '}
                -{' '}
              </button>
              <span>{product.quantity}</span>
              <button onClick={() => increaseProductQuantity(product._id)}>
                {' '}
                +{' '}
              </button>
            </div>

            <div
              className="delete"
              onClick={() => deleteProductFromCart(product._id)}
            >
              X
            </div>
          </div>
        </div>
      ))}

      <div className="total">
        <h3>Total: R {total}</h3>
        <PayPalScriptProvider>
          <PayPalButtons total={total} />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}

/* We export the 'Cart' component in order to display this code in App.js. */
export default Cart;
