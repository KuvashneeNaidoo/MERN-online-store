// Require Mongoose library.
const mongoose = require('mongoose');

/**
 * I defined the user collection fields and mongoose schema types of the users.
 * Timestamps are used to show the creation date of the users.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    cart: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Export userSchema to be used in our application.
module.exports = mongoose.model('Users', userSchema);
