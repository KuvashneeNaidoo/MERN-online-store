// Requiring Express and Router from Express
const router = require('express').Router();
// Requiring controllers from categoryController.js.
const categoryController = require('../controllers/categoryController');
// Requiring auth and authAdmin middleware
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

// These routes will be used to retrieve (get) and create (post) product categories.
router
  .route('/category')
  .get(categoryController.getCategories)
  .post(auth, authAdmin, categoryController.createCategory);

// The route will be used to update (put) and delete product categories.
router
  .route('/category/:id')
  .delete(auth, authAdmin, categoryController.deleteCategory)
  .put(auth, authAdmin, categoryController.updateCategory);

// Exporting categoryRouter to server.js.
module.exports = router;
