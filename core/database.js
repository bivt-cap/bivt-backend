// Load MySQL
const mysql = require('mysql');

// Configuration
const config = require('./config');

// Create the pool connection
let pool;

// Host connection or Socket Path connection
if (config.database.host) {
  pool = mysql.createPool({
    connectionLimit: 10,
    host: config.database.host,
    user: config.database.user,
    password: config.database.pass,
    database: config.database.name,
  });
} else {
  pool = mysql.createPool({
    connectionLimit: 10,
    user: config.database.user,
    password: config.database.pass,
    database: config.database.name,
    socketPath: config.database.socketpath,
  });
}

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
