// Load MySQL
const mysql = require('mysql');

// Configuration
const config = require('./config');

// Create the pool connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.database.host,
  user: config.database.user,
  password: config.database.pass,
  database: config.database.name,
});

// Export que query function
module.exports = async (q, params) =>
  new Promise((resolve, reject) => {
    const callback = (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    };

    pool.query(q, params, callback);
  });
