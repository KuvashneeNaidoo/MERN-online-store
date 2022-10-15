// Require Mongoose library.
const mongoose = require('mongoose');

/**
 * I defined the category collection fields and mongoose schema types of the categories.
 * Timestamps are used to show the creation date of the categories.
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export categorySchema to be used in our application.
module.exports = mongoose.model('Category', categorySchema);
