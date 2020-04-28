// Environment Variables (https://www.npmjs.com/package/dotenv)
require('dotenv').config();

// Express (https://www.npmjs.com/package/express)
const express = require('express');

const app = express();

// Body Parser (https://www.npmjs.com/package/body-parser)
const bodyParser = require('body-parser');

// Cors (https://www.npmjs.com/package/cors)
const cors = require('cors');

// Enable cors in Express
app.use(cors());

// Set Body Parser in Express
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// Use JSON in the Body Parser
app.use(bodyParser.json());

// ******************************************
// TEST PURPOSE - NEED TO REMOVE
// ******************************************
app.get('/', (req, res) => res.send('BIVT Back-End'));
// ******************************************
// TEST PURPOSE - NEED TO REMOVE
// ******************************************

// Start listening
app.listen(process.env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${process.env.port}!`);
});
