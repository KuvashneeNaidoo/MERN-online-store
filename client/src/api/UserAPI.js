/* Importing the libraries and hooks that I need */
import { useState, useEffect } from 'react';
import axios from 'axios';

/* We will use UserAPI (token) for authentication. Within this API, we will create some states to store our the cart items
and history of the users activities. The states of the inital values for the cart items and history will be empty 
since the values will always be changing. We use the useState hook to declare our variables. This will help to preserve our values each time it 
is called. We will update the state with a callback.*/
function UserAPI(token) {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);

  /**
   * We will use the useEffect hook to fetch our data.
   * If the token exists for authentication, axios will make a GET request to the API.
   * This will help us to get our user information from port number 8080 which is then stored in our database.
   * When the role of the user is set to 1, this is specifically for the admin of which this state will then be updated.
   * The getUser() function will then be called and set.
   */
  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get('/user/infor', {
            headers: { Authorization: token },
          });
          setIsLogged(true);
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

          setCart(res.data.cart);
        } catch (error) {
          alert(error.response.data.msg);
        }
      };
      getUser();
    }
  }, [token]);

  /* The user has to be logged in to add items to the cart. */
  const addCart = async (product) => {
    if (!isLogged)
      return alert('Please login or register to add items to your cart.');

    /* The every() method is used of which may return true only if every item found within the cart array based 
    on the id passes the condition. If the check variable is true, we update and set the state. */
    const check = cart.every((item) => {
      return item._id !== product._id;
    });
    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);

      /**
       * A patch request is made to modify the cart data such as the quantity of items in the cart.
       * An authorization token is passed in the header to protect user information.
       * If the user adds the same product twice to their cart, a message will return.
       */
      await axios.patch(
        '/user/addcart',
        { cart: [...cart, { ...product, quantity: 1 }] },
        {
          headers: { Authorization: token },
        }
      );
    } else {
      alert('You have already added this product to your cart.');
    }
  };

  /* We return the states to be used in other components. */
  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart: addCart,
    history: [history, setHistory],
  };
}

/* We export UserAPI to be used in other components for the application to function. */
export default UserAPI;
