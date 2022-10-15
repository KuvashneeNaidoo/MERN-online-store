/* The code here will help us to get, create, delete and update the products in
our application as well as filter, sort and load more products.*/
const Products = require('../models/productModel');

// We create an APIfeatures class which will filter, sort and load more products through use of a query string.
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * We will first filter our products.
   * The queryString array is used to retrieve the data which will be stored in an object.
   * excludedFields will exclude and store the data which does not match the filter request.
   * A forEach loop will loop over and remove products which do not form part of the search request.
   * Operators are created to determine if the results are greater than or equal (gte), lesser than or equal (lte), lesser than (lt) or greater than (gt).
   * The query string will then be replaced with the data which matches the filter requests.
   */
  filtering() {
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => '$' + match
    );
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  /**
   * Here we sort our products.
   * We use this.queryString.sort to determine if the data retrieved matches the sorting correctly and if it is true, then this data will be stored.
   * If the sorting of the data retrieved is not true, then the createdAt date will be excluded from the sorting method.
   */
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * Now we will create variables to load more products.
   * Created a variable which will limit the number of products displayed on the page to 8 products.
   * The Load More button will appear below the 8 products so the user can view more products after clicking on the button.
   * We use the skip variable to pass over and ignore these values.
   */
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 8;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

/**
 * GET (READ)
 * The get method reads all the existing product data which will be requested from MongoDB.
 * We will search through the products and link them to the filtering, sorting and paginating methods.
 * This data is thereafter returned as a response.
 * An error message will appear if the data could not been returned.
 */
const productController = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();

      const products = await features.query;

      res.json({
        status: 'success',
        result: products.length,
        products: products,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  /**
   * POST (CREATE)
   * Only the administrator can create, delete and update products since their role on the database is = 1.
   * The post method creates a new product based on the product's id, title, price, description, content, images and category.
   * To create a new product, the body of the products are searched through to identify its properties.
   * An if statement is used to determine if an image was uploaded or not.
   * If a product already exists, an error message will be returned.
   */
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;
      if (!images)
        return res.status(400).json({ msg: 'The image was not uploaded.' });

      const product = await Products.findOne({ product_id });
      if (product)
        return res.status(400).json({ msg: 'This product already exists.' });

      /**
       * If a product does not already exist, a message will appear when the creation has been successful.
       * This new product will be saved in the database.
       */
      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });

      await newProduct.save();
      res.json({ msg: 'Created a product' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  /**
   * DELETE
   * To delete a specific category, we first use the findByIdAndDelete method.
   * The findByIdAndDelete method will be used to remove a product based on its id number.
   * A message will appear if removal has been successful or not.
   */
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Deleted a Product' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  /**
   * PUT (UPDATE)
   * The put method will be used to find and update one product based on the id number.
   * An if statement is used to determine if an image was uploaded or not.
   * A message will appear if the update has been successful or not.
   */

  updateProduct: async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;
      if (!images)
        return res.status(400).json({ msg: 'The image was not uploaded.' });

      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );

      res.json({ msg: 'The product has been successfully updated.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

// We will export the functions in the productController to be used in our productRouter.
module.exports = productController;
