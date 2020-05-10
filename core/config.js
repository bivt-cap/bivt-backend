// Environment Variables (https://www.npmjs.com/package/dotenv)
require('dotenv').config();

module.exports = {
  port: process.env.SERVER_PORT,
  authorization: {
    salt: process.env.AUTH_SALT,
    secret: process.env.AUTH_SECRET,
  },
  email: {
    test: process.env.EMAIL_TEST,
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
};
