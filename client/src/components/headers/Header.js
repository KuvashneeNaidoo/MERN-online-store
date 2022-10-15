import React, { useContext, useState } from 'react';
import { GlobalState } from '../../GlobalState';
import Menu from './icons/menu.svg';
import Close from './icons/close.svg';
import Cart from './icons/cart.svg';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './header.css';

// Create some states within the Header function.
function Header() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [cart] = state.userAPI.cart;
  const [menu, setMenu] = useState(false);

  /**
   * We create a function to logout the user.
   * Axios will make a GET request to perform this process.
   * Once logged out, the firstLogin key will be removed from the local storage.
   * The user will then be redirected to the home page.
   */
  const userLogoutProcess = async () => {
    await axios.get('/user/logout');
    localStorage.removeItem('firstLogin');
    window.location.href = '/';
  };

  // The Create Products and Categories header will be displayed for the admin user when he/she is logged in.
  const headerOptionsForAdminUsers = () => {
    return (
      <>
        <li>
          <Link to="/create_product">Create Products</Link>
        </li>
        <li>
          <Link to="/category">Categories</Link>{' '}
        </li>
      </>
    );
  };

  // The Logout header will be displayed for the user/customer when he/she is logged in.
  const headerOptionsForNonAdminUsers = () => {
    return (
      <>
        <li>
          <Link to="/" onClick={userLogoutProcess}>
            Logout
          </Link>
        </li>
      </>
    );
  };

  // Storing styles
  const styleInformation = {
    left: menu ? 0 : '-100%',
  };

  /*
   * The layout of the header is presented in code below.
   * The logo will appear on the top left corner which will reflect as 'Admin' for admin users and 'Phantom' for customers.
   * The Header options are different for the admin and customer.
   * A user can still browse through the website without logging in/registering. However, adding items to the cart requires you to be logged in.
   * The cart icon with the product count will be displayed for customers who are logged in only.
   */
  return (
    <header>
      <div className="menu" onClick={() => setMenu(!menu)}>
        <img src={Menu} alt="" width="30" />
      </div>
      <div className="header">
        <h1 className="logo">
          <Link to="/">{isAdmin ? 'Admin' : 'Phantom'}</Link>
        </h1>
        <div className={isAdmin ? 'adminLogo' : 'logoContainer'}></div>
      </div>
      <ul style={styleInformation}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/shop">{isAdmin ? 'Products' : 'Shop'}</Link>
        </li>
        {isAdmin && headerOptionsForAdminUsers()}
        {isLogged ? (
          headerOptionsForNonAdminUsers()
        ) : (
          <>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/login">Login Or Register</Link>
            </li>
          </>
        )}
        <li onClick={() => setMenu(!menu)}>
          <img src={Close} alt="" width="30" className="menu" />
        </li>
      </ul>
      {isAdmin ? (
        ''
      ) : (
        <div className="cart-icon">
          <span>{cart.length}</span>
          <Link to="/cart">
            <img src={Cart} alt="" width="30" />
          </Link>
        </div>
      )}
    </header>
  );
}

/* We export the 'Header' component in order to display this code in App.js. */
export default Header;
