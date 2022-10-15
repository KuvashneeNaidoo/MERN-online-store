// Requiring Express and Router from Express
const router = require('express').Router();
// Requiring controllers from productController.js.
const productController = require('../controllers/productController');
// Requiring auth and authAdmin middleware
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

// These routes will be used to retrieve (get) and create (post) the products.
router
  .route('/products')
  .get(productController.getProducts)
  .post(auth, authAdmin, productController.createProduct);

// The route will be used to update (put) and delete the products.
router
  .route('/products/:id')
  .delete(auth, authAdmin, productController.deleteProduct)
  .put(auth, authAdmin, productController.updateProduct);

// Exporting productRouter to server.js.
module.exports = router;
