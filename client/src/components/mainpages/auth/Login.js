import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';

// Created states within the Login function
function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  // A function is created in order to handle the email and password input changes.
  const userInputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  /**
   * A function is created in order to handle the login process once the user enters their details.
   * Axios will make a POST request to login the user of which the details will be stored in our database.
   * The firstLogin key will be set as true until he/she logs out.
   * The local storage will be updated and the user will return back to the homepage.
   * If the login is not successful, an error message will be returned.
   */
  const userLoginHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/user/login', { ...user });
      localStorage.setItem('firstLogin', true);
      window.location.href = '/';
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  // Creating the login/registration page which has a toggle feature.
  return (
    <div className="login-page">
      <form onSubmit={userLoginHandler}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          value={user.email}
          onChange={userInputHandler}
        />

        <input
          type="password"
          name="password"
          required
          autoComplete="on"
          placeholder="Enter your password"
          value={user.password}
          onChange={userInputHandler}
        />

        <div className="row">
          <button type="submit">Login</button>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

/* We export the 'Login' component in order to display this code in App.js. */
export default Login;
