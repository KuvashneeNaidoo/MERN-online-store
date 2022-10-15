/* All of the page routing for React App is present here */
import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import Products from './products/Products';
import Login from './auth/Login';
import Register from './auth/Register';
import Cart from './cart/Cart';
import NotFound from './utils/not_found/NotFound';
import ProductDetail from './productDetail/ProductDetail';
import About from '../../components/about/About';
import Contact from '../../components/contact/Contact';
import Home from '../../components/Home/Home';
import { GlobalState } from '../../GlobalState';
import Categories from './categories/Categories';
import CreateProduct from './createProducts/CreateProduct';

// Created states within the Pages function allowing us to log in and accees the user/admin panel.
function Pages() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;

  // Render all the components which hold and return the data for the online store.
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/shop" exact component={Products} />
      <Route path="/detail/:id" exact component={ProductDetail} />

      <Route path="/login" exact component={isLogged ? NotFound : Login} />
      <Route
        path="/register"
        exact
        component={isLogged ? NotFound : Register}
      />
      <Route
        path="/category"
        exact
        component={isAdmin ? Categories : NotFound}
      />
      <Route
        path="/create_product"
        exact
        component={isAdmin ? CreateProduct : NotFound}
      />
      <Route
        path="/edit_product/:id"
        exact
        component={isAdmin ? CreateProduct : NotFound}
      />
      <Route path="/cart" exact component={Cart} />
      <Route path="/about" exact component={About}></Route>
      <Route path="/contact" exact component={Contact}></Route>
      <Route path="*" exact component={NotFound} />
    </Switch>
  );
}

export default Pages;
