const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

/* We add our middleware. Using express.json will allow the server to accept incoming json requests in a 
json format. Morgan will help us to visualize our endpoints when testing out our server with Postman.
Helmet is also used for security purposes. */
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// configure env.
require('dotenv').config();

// We require/get the routes and use each of them
app.use('/user', require('./routes/userRouter'));
app.use('/api', require('./routes/categoryRouter'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/productRouter'));

/* Creating a variable that stores the connection string needed in order to connect to my MongoDB database. */
const uri = process.env.uri;

/* Using the mongoose library in order to make a connection to my MongoDB database. */
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// An error message will be displayed in the console if MongoDB fails to connect.
mongoose.connection.on('error', function () {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});

// A message will be displayed in the console if MongoDB successfully connects.
mongoose.connection.once('open', function () {
  console.log('Successfully connected to the database');
});

/* We will call React build assets by changing this express file. We make use of the production process 
whereby express.static middleware will be used to access files from the frontend index.html folder via HTTP. */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

/* To run our server, we specify that it listens to port number 8080 which we get from the environment 
variables. We add a callback to confirm this and to navigate to the port. */
const PORT = process.env.PORT || 8080;
app.listen(PORT);
console.log('Navigate to http://localhost:8080');

// I used this function below to initiate an error statement if an error occurs.
app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send('Something broke!');
});
