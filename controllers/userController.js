/* The code here will be used to create user and admin login/registration with authentication.*/
const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * First we will create a controller to register a new user.
 * To register a new user, we request the body properties such as the name, email and password which is then stored.
 * We use the if statement to check through the database to see if the email entered exists or not.
 * If the email entered already exists, a message will be returned.
 * The if statement is also used to check if the password entered is atleast 6 characters long.
 * If the password entered is shorter then 6 characters, a message will be returned.
 */
const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: 'The email already exists.' });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: 'The password must be atleast 6 characters long.' });

      /**
       * Password Encryption
       * The brcypt module is used to hask the password with the result being displayed as passwordHash.
       * A new user is created, added and then saved to the database based on the details he/she entered in the registration form.
       */
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });
      await newUser.save();

      // We now create the jsonwebtoken ( access token and refresh token) for user authentication.
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      // A cookie is set to 7 days for the refresh token.
      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // The access token is returned. If not, an error message will be returned.
      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  /**
   * We will create the code used to log the user in.
   * To login the user, we request the body properties such as the email and password which is then stored.
   * We use the if statement to check through the database to see if the user exists or not.
   * If the users email address or password does not match with information stored in the database, a message will be returned.
   * Bcrypt compares the hashed password which is stored in the database with the password that the user enters.
   * If the password does not match, a message will be returned.
   * If the user logs in successfully, the access token and refresh token will be created.
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: 'The user does not exist.' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ msg: 'The password entered is incorrect.' });

      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      // A cookie is set to 7 days for the refresh token.
      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // The access token is returned. If not, an error message will be returned.
      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  /**
   * We will create the code used to log the user out.
   * When the user is logged out, all cookie information is cleared.
   * A message is then returned when the user successfully logs out.
   */
  logout: async (req, res) => {
    try {
      res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
      return res.json({ msg: 'Logged out' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  /**
   * Creating the refresh token
   * A refresh token is created and stored when the user registers or logs in.
   * The user is prompted to login or register, otherwise the refresh token will not be generated.
   * JWT will be used to verify the rf_token in relation to the REFRESH_TOKEN_SECRET from the .env file.
   */
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: 'Please Login or Register' });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: 'Please Login or Register' });

        /* An access token is created for each user. */
        const accesstoken = createAccessToken({ id: user.id });
        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  /**
   * GET user (READ)
   * The get method reads all the user data (excluding their passwords) which will be requested from MongoDB.
   * This data is thereafter returned as a response.
   * This will check if the user exists or not. If not, a message will be returned.
   * An error message will appear if the data could not been returned.
   */
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select('-password');
      if (!user)
        return res.status(400).json({ msg: 'The user does not exist.' });
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  /**
   * For a user to add items to their cart, he/she must be authenticated first.
   * We will use the findById method to see if the the user exists or not. If not, a message will be returned.
   * The findOneAndUpdate method is used when the user does exist of which a success message will appear.
   */
  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user)
        return res.status(400).json({ msg: 'The user does not exist.' });
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );
      return res.json({ msg: 'An item has been added to the cart' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

// Created an access token for a user to sign in of which will expire in 10m.
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
};

// Created an refresh token for a user to sign in of which will expire in 7d.
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

// We will export the functions in the userController to be used in our userRouter.
module.exports = userController;
