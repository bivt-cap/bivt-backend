// Environment Variables (https://www.npmjs.com/package/dotenv)
require('dotenv').config();

// Node.JS module
const path = require('path');

// Express (https://www.npmjs.com/package/express)
const express = require('express');

const app = express();

// Body Parser (https://www.npmjs.com/package/body-parser)
const bodyParser = require('body-parser');

// Cors (https://www.npmjs.com/package/cors)
const cors = require('cors');

// Load a file and replace its content
const replaceContent = require('./core/replaceContent');

// Enable cors in Express
app.use(cors());

// Set Body Parser in Express
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// We don't want to serve all folder inside public so we specify which one we want to
app.use('/css', express.static(path.join(__dirname, './public/css')));
app.use('/images', express.static(path.join(__dirname, './public/images')));
app.use('/js', express.static(path.join(__dirname, './public/js')));

// Use JSON in the Body Parser
app.use(bodyParser.json());

// Custom Template engine
app.engine('thtml', (file, options, callback) => {
  return callback(null, replaceContent(file, options));
});

app.set('views', './public/template');
app.set('view engine', 'thtml');

// Routes
app.use('/user', require('./routes/user'));

// Start listening
app.listen(process.env.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${process.env.SERVER_PORT}!`);
});
