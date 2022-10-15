// Requiring Express and Router from Express
const router = require('express').Router();
// Requiring controllers from userController.js.
const userController = require('../controllers/userController');
// Requiring auth middleware
const auth = require('../middleware/auth');

// These routes will be used by the user when gaining access to the site.
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/refresh_token', userController.refreshToken);
router.get('/infor', auth, userController.getUser);
router.patch('/addcart', auth, userController.addCart);

// Exporting userRouter to server.js.
module.exports = router;
