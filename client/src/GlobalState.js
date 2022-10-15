import React, { createContext, useState, useEffect } from 'react';
import ProductsAPI from './api/ProductsAPI';
import axios from 'axios';
import UserAPI from './api/UserAPI';
import CategoriesAPI from './api/CategoriesAPI';

/**
 * The global state variable is exported of which will be used in site.
 * The DataProvider will be used to pass down and render the children elements.
 */
export const GlobalState = createContext();
export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  /**
   *  The useEffect hook will help us to check if the firstLogin key which is stored in the local storage has a key.
   * If the firstLogin does have a value, a GET request is made to the API to retrieve the refresh_token.
   * We will then set the token to be equal to the accesstoken.
   * A timeout will however be set to 10 minutes.
   */
  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin');
    if (firstLogin) {
      const refreshToken = async () => {
        const res = await axios.get('/user/refresh_token');
        setToken(res.data.accesstoken);
        setTimeout(() => {
          refreshToken();
        }, 10 * 60 * 1000);
      };
      refreshToken();
    }
  }, []);

  /* We store state variables which will hold the data we need for our site. */
  const state = {
    token: [token, setToken],
    productsAPI: ProductsAPI(),
    userAPI: UserAPI(token),
    categoriesAPI: CategoriesAPI(),
  };

  // Returning the state object in order to use the variables for the client side to function.
  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
