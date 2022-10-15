import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';

// Created states within the Register function
function Register() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  // A function is created in order to handle the name, email and password input changes.
  const userInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  /**
   * A function is created in order to handle the registration process once the user enters their details.
   * Axios will make a POST request to register the user of which the details will be stored in our database.
   * The firstLogin key will be set as true until he/she logs out.
   * The local storage will be updated and the user will return back to the homepage.
   * If the registration is not successful, an error message will be returned.
   */
  const userRegistrationSubmission = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/user/register', { ...user });
      localStorage.setItem('firstLogin', true);
      window.location.href = '/';
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  // Creating the login/registration page which has a toggle feature.
  return (
    <div className="login-page">
      <form onSubmit={userRegistrationSubmission}>
        <h2>Register</h2>
        <input
          type="text"
          name="name"
          required
          placeholder="Enter your name"
          value={user.name}
          onChange={userInputChange}
        />

        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          value={user.email}
          onChange={userInputChange}
        />

        <input
          type="password"
          name="password"
          required
          autoComplete="on"
          placeholder="Enter your password"
          value={user.password}
          onChange={userInputChange}
        />

        <div className="row">
          <button type="submit">Register</button>
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}

/* We export the 'Register' component in order to display this code in App.js. */
export default Register;
