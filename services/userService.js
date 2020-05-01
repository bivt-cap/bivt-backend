// SHA1 Encrypt
const sha1 = require('sha1');

// Node.JS module
const path = require('path');
const crypto = require('crypto');

// JWT
const jwt = require('jsonwebtoken');

// Database
const query = require('../core/database');

// Send Email
const sendEmail = require('../core/sendEmail');

// Replace content from a file
const replaceContent = require('../core/replaceContent');

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
            , U.emailValidationHash
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
            parseInt(result[0].isBlocked, 10) === 1,
            result[0].emailValidationHash
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
   * @param baseUrl {string} Url base for our api
   * @return {string} Validation Email URL
   */
  async addNewUser(email, password, firstName, lastName, baseUrl) {
    // Create an email validation Hash
    const emailValidationHash = crypto.randomBytes(128).toString('hex');

    return await query(
      `INSERT INTO tb_user 
        (email, password, firstName, lastName, emailValidationHash, emailValidationExpires) 
        VALUES
        (?, ?, ?, ?, ?, NOW() + INTERVAL 1 DAY)`,
      [
        email,
        sha1(process.env.AUTH_SALT + password),
        firstName,
        lastName,
        emailValidationHash,
      ]
    )
      .then((result) => {
        // Check if has result
        if (result != null) {
          // Obtem os dados do usario
          return this.getUserById(parseInt(result.insertId, 10))
            .then((user) => {
              if (user !== null && user.id > 0) {
                // Load the template
                const emailTemplate = replaceContent(
                  path.join(
                    __dirname,
                    '../public/email/verifyEmailAccount.html'
                  ),
                  {
                    userName: user.firstName,
                    baseUrl,
                    emailToken: user.emailValidationHash,
                  }
                );

                // Send email to check if is a real email
                return sendEmail(
                  email,
                  'Verify your account',
                  '',
                  emailTemplate
                )
                  .then(() => {
                    return `${baseUrl}/user/checkEmail?token=${user.emailValidationHash}`;
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

  /*
   * Validate the User Email
   * @param hash {string} Email Hash to validate user
   * @return {bool} Return true if the email validated and false if not
   */
  async validateEmail(hash) {
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
            U.emailValidationHash = ?
            AND U.emailValidatedAt IS NULL
            AND U.emailValidationExpires >= NOW()`,
      [hash]
    )
      .then((user) => {
        // Check if has result
        if (user != null && user.length > 0) {
          return query(
            `UPDATE 
                tb_user
              SET 
                emailValidatedAt = NOW()
              WHERE	
                id = ?`,
            [user[0].id]
          )
            .then((result) => {
              return result != null && result.changedRows > 0;
            })
            .catch((error) => {
              throw error;
            });
        }

        // Not Valid
        return false;
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export the service class
module.exports = UserService;
