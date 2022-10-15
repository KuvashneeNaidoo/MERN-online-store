// Requiring Express and Router from Express
const router = require('express').Router();
/* Require cloudinary to store images */
const cloudinary = require('cloudinary');
// Requiring auth and authAdmin middleware
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
/* Require the file system */
const fs = require('fs');

/**
 * All product images have been uploaded to my cloudinary account.
 * API keys to access Cloudinary have been stored in the .env file.
 */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/**
 * The admin user can also upload product images from the admin panel.
 * The if statement is used to check if an image has been uploaded. If not, a message will be returned.
 * When uploading images, two factors are taken into account, namely size and format.
 * The image must be smaller than 1024*1024. If the image is bigger, a message will be returned.
 * The image must also be in either jpeg or png format. If not, a message will be returned.
 * removeTmp is used to remove the temporary file which gets created each time an image is uploaded.
 */
router.post('/upload', auth, authAdmin, (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ msg: 'No files have been uploaded.' });

    const file = req.files.file;
    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath);
      return res.status(400).json({
        msg: 'The size of the image is too large. It must be less than 1024x1024',
      });
    }

    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      removeTmp(file.tempFilePath);
      return res.status(400).json({
        msg: 'The format of your file is incorrect. The image must be either jpeg or png.',
      });
    }

    /**
       * When the admin uploads images from the site, these images will be stored in the test folder in my Cloudinary account.
       * removeTmp is used to remove the temporary file which gets created each time an image is uploaded.
       * We check if there are any errors occur during the upload.
       * If the upload is successful, the temporary file created will be removed and a 'public_id' and
         'secure_url' will be created (can be seen on MongoDB) which is used to access the image.
       */
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: 'test' },
      async (err, result) => {
        if (err) throw err;

        removeTmp(file.tempFilePath);

        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

/**
 * The admin user can delete product images from the admin panel.
 * To delete an image, the body of the image is searched to identify the public_id.
 * If the public_id is returned, the image will be deleted. If not, a message will be returned.
 */
router.post('/destroy', auth, authAdmin, (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id)
      return res.status(400).json({ msg: 'No image has been selected' });

    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;

      res.json({ msg: 'The image has been deleted.' });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

// Exporting the upload route to server.js.
module.exports = router;
