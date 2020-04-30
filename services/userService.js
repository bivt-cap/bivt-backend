// SHA1 Encrypt
const sha1 = require('sha1');

// Database
const query = require('../core/database');

// Send Email
const sendEmail = require('../core/sendEmail');

// Models
const User = require('../models/user/user');

/*
 * Business Logic related to the User
 */
class UserService {
  /*
   * Find an user by email
   * @param email {string} Find an user using this email to filter
   * @return {User} User
   */
  async getUserByEmail(email) {
    return await query(
      `SELECT 
            U.id
            , U.extId
            , U.email
            , U.password
            , U.firstName
            , U.lastName
            , CASE WHEN U.emailValidatedAt IS NULL THEN 1 ELSE 0 END AS isBlocked
        FROM 
            tb_user AS U
        WHERE 
            U.email = ?`,
      [email]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the User
          return new User(
            parseInt(result[0].id, 10),
            result[0].extId,
            result[0].email,
            result[0].password,
            result[0].firstName,
            result[0].lastName,
            parseInt(result[0].isBlocked, 10) === 1
          );
        }
        return null;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Find an user by Id
   * @param id {int} Find an user using the id to filter
   * @return {User} User
   */
  async getUserById(id) {
    return await query(
      `SELECT 
            U.id
            , U.extId
            , U.email
            , U.password
            , U.firstName
            , U.lastName
            , CASE WHEN U.emailValidatedAt IS NULL THEN 1 ELSE 0 END AS isBlocked
        FROM 
            tb_user AS U
        WHERE 
            U.id = ?`,
      [id]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the User
          return new User(
            parseInt(result[0].id, 10),
            result[0].extId,
            result[0].email,
            result[0].password,
            result[0].firstName,
            result[0].lastName,
            parseInt(result[0].isBlocked, 10) === 1
          );
        }
        return null;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Add an new user
   * @param email {string} Email
   * @param password {string} Password
   * @param firstName {string} First Name
   * @param lastName {string} Last Name
   * @return {int} User Id
   */
  async addNewUser(email, password, firstName, lastName) {
    return await query(
      `INSERT INTO tb_user 
        (email, password, firstName, lastName) 
        VALUES
        (?, ?, ?, ?)`,
      [email, sha1(process.env.AUTH_SALT + password), firstName, lastName]
    )
      .then((result) => {
        // Check if has result
        if (result != null) {
          // Obtem os dados do usario
          return this.getUserById(parseInt(result.insertId, 10))
            .then((user) => {
              if (user !== null && user.id > 0) {
                // Send email to check if is a real email
                return sendEmail(
                  email,
                  'Verify account',
                  '<h1>test</h1><h3>[USER_ID]</h3>',
                  {
                    '[USER_ID]': user.extId,
                  }
                )
                  .then(() => {
                    return user.extId;
                  })
                  .catch((error) => {
                    throw error;
                  });
              }
              throw new Error('Internal Server Error');
            })
            .catch((error) => {
              throw error;
            });
        }
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export the service class
module.exports = UserService;
