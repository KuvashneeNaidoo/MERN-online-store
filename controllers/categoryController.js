/* The code here will help us to get, create, delete and update the categories in
our database based on the products we have on the site.*/
const Category = require('../models/categoryModel');
const Products = require('../models/productModel');

/**
 * GET (READ)
 * The get method reads all the existing category data which will be requested from MongoDB.
 * This data is thereafter returned as a response.
 * An error message will appear if the data could not been returned.
 */
const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  /**
   * POST (CREATE)
   * Only the administrator can create, delete and update categories since their role on the database is = 1.
   * To create a new category, the body of the categories are searched through to identify its properties.
   * If a category already exists, an error message will be returned.
   * If a category does not already exist, a message will appear when the creation has been successful.
   */
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ name });
      if (category)
        return res.status(400).json({
          msg: 'Sorry! This category already exists. Try a different name.',
        });

      const newCategory = new Category({ name });

      await newCategory.save();
      res.json({ msg: 'You have successfully created a new category.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  /**
   * DELETE
   * To delete a specific category, we first use the findOne method.
   * We make a request to identify if any products already exist under the category we want to delete.
   * If products are listed under the category, these products must be deleted first before deleting the name of the category.
   * The findByIdAndDelete method will be used to remove a category based on the id number of the products.
   * A message will appear if removal has been successful or not.
   */
  deleteCategory: async (req, res) => {
    try {
      const products = await Products.findOne({ category: req.params.id });
      if (products)
        return res.status(400).json({
          msg: 'First delete all items listed under this category before you can delete the specific category name.',
        });

      await Category.findByIdAndDelete(req.params.id);
      res.json({ msg: 'You have successfully deleted a category' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  /**
   * PUT (UPDATE)
   * The put method will be used to update the name of one category based on the id number.
   *  A message will appear if the update has been successful or not.
   */
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.findOneAndUpdate({ _id: req.params.id }, { name });

      res.json({ msg: 'You have successfully updated a category.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

// We will export the functions in the categoryController to be used in our categoryRouter.
module.exports = categoryController;
