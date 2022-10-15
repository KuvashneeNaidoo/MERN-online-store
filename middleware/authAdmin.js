// We import the user model in order to distinguish between the role of the admin and the user.
const Users = require('../models/userModel');

/**
 * We will check if the user logging in is a normal end user or administrator.
 * The findOne method will find a user based on their id.
 * If the role of the user is equal to 0, he/she will be identified not be identified as admin and therefore will be denied admin access.
 * The role of the admin user is set to 1 of which only that user will gain access to the admin panel.
 */
const authAdmin = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      _id: req.user.id,
    });
    if (user.role === 0)
      return res.status(400).json({ msg: 'Admin resources access denied' });

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// We will export the authAdmin functions to be used in our Routers.
module.exports = authAdmin;
