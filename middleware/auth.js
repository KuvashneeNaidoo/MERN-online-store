// Created the JWT token user authentication/authorization. If the details are incorrect, an error will occur.
const jwt = require('jsonwebtoken');

/**
 * We will check if a user has a JSON Web token for verification. If no token is present, a message will be returned.
 * We then check to see if the JWT is passed through the header which has a key of 'Authorization'.
 * If no token is present, authentication will be is invalid.
 * If valid, we will check the token against the ACCESS_TOKEN_SECRET.
 * The user will be verified only if no errors are detected.
 */
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) return res.status(400).json({ msg: 'Invalid Authentication' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: 'Invalid Authentication' });

      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// We will export the auth functions to be used in our Routers.
module.exports = auth;
