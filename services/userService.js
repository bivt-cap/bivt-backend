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
const AuthToken = require('../models/auth/authToken');

/*
 * Business Logic related to the User
 */
class UserService {
  constructor() {
    // Default Select for User information
    this.defaultSelectUser = `SELECT 
        U.id
        , U.extId
        , U.email
        , U.password
        , U.firstName
        , U.lastName
        , CASE WHEN U.emailValidatedAt IS NULL THEN 1 ELSE 0 END AS isBlocked
        , U.emailValidationHash
        , U.emailValidatedAt
        , U.emailForgotPasswordHash
    FROM 
        tb_user AS U`;
  }

  /*
   * Convert the Database Result to the User Entity
   * @param result {Array} Result returned from database
   * @return {User} User
   */
  defaultSelectUserResult(resultDB) {
    // Return the User
    return new User(
      parseInt(resultDB[0].id, 10),
      resultDB[0].extId,
      resultDB[0].email,
      resultDB[0].password,
      resultDB[0].firstName,
      resultDB[0].lastName,
      parseInt(resultDB[0].isBlocked, 10) === 1,
      resultDB[0].emailValidationHash,
      resultDB[0].emailValidatedAt,
      resultDB[0].emailForgotPasswordHash
    );
  }

  /*
   * Find an user by email
   * @param email {string} Find an user using this email to filter
   * @return {User} User
   */
  async getUserByEmail(email) {
    return await query(
      `${this.defaultSelectUser}
        WHERE 
            U.email = ?`,
      [email]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the User
          return this.defaultSelectUserResult(result);
        } else {
          return null;
        }
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
      `${this.defaultSelectUser}
        WHERE 
            U.id = ?`,
      [id]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the User
          return this.defaultSelectUserResult(result);
        } else {
          return null;
        }
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
    const emailValidationHash = crypto.randomBytes(50).toString('hex');

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
                return this.sendValidationEmail(user, baseUrl);
              } else {
                throw new Error('Internal Server Error');
              }
            })
            .catch((error) => {
              throw error;
            });
        } else {
          throw new Error('Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Send a Validation Email
   * @param email {string} Email
   * @return {string} Validation Email URL
   */
  async sendValidationEmail(user, baseUrl) {
    // Load the template
    const emailTemplate = replaceContent(
      path.join(__dirname, '../public/email/verifyEmailAccount.html'),
      {
        userName: user.firstName,
        baseUrl,
        emailToken: user.emailValidationHash,
      }
    );

    // Send email to check if is a real email
    return sendEmail(user.email, 'Verify your account', '', emailTemplate)
      .then(() => {
        return `${baseUrl}/user/validateEmail?token=${user.emailValidationHash}`;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Resend a Validation Email
   * @param email {string} Email
   * @return {string} Validation Email URL
   */
  async resendValidationEmail(email, baseUrl) {
    return await this.getUserByEmail(email)
      .then((user) => {
        // Check if the user was found
        // Check if the email was already validated
        if (user !== null && user.emailValidatedAt === null) {
          // Create an email validation Hash
          // eslint-disable-next-line no-param-reassign
          user.emailValidationHash = crypto.randomBytes(50).toString('hex');

          // Update the user with a new hash and expiration date
          return query(
            `UPDATE 
                tb_user
              SET 
                emailValidationHash = ?
                , emailValidationExpires = NOW() + INTERVAL 1 DAY
              WHERE
                id = ?`,
            [user.emailValidationHash, user.id]
          )
            .then((result) => {
              if (result != null && result.changedRows > 0) {
                return this.sendValidationEmail(user, baseUrl);
              } else {
                // User not found or already validated in the past
                return null;
              }
            })
            .catch((error) => {
              throw error;
            });
        } else {
          // User not found or already validated in the past
          return null;
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
      `${this.defaultSelectUser}
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
                , emailValidationExpires = NOW()
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
        } else {
          // Not Valid
          return false;
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Authenticate the user
   * @param email {string} User Email
   * @param password {string} User Password
   * @return {AuthToken} Return the Authorization Token
   */
  async authenticate(email, password) {
    // Find the user using the email as filter
    return await this.getUserByEmail(email)
      .then((user) => {
        // Check if a user was found
        // Check if the user is not blocked
        // Check if password is equals
        if (
          user != null &&
          !user.isBlocked &&
          user.password === sha1(process.env.AUTH_SALT + password)
        ) {
          // Generate the token
          const token = jwt.sign(
            {
              extId: user.extId,
            },
            process.env.AUTH_SECRET,
            {
              // Token expires in 1 hour
              expiresIn: 3600,
            }
          );

          // return the token
          return new AuthToken(token);
        } else {
          return null;
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Generate token to allow user to change the password
   * @param email {string} User Email
   * @return {string} Change password URL
   */
  async forgotPassword(email, baseUrl) {
    // Find the user using the email as a filter
    return await this.getUserByEmail(email)
      .then((user) => {
        // Check if a user was found
        // Check if the user is not blocked
        if (user != null && !user.isBlocked) {
          // Create an email validation Hash
          // eslint-disable-next-line no-param-reassign
          const emailForgotPasswordHash = crypto
            .randomBytes(50)
            .toString('hex');

          // Update the user with a new hash and expiration date
          return query(
            `UPDATE 
                  tb_user
              SET 
                emailForgotPasswordHash = ?
                , emailForgotPasswordExpires = NOW() + INTERVAL 1 DAY
              WHERE
                  id = ?`,
            [emailForgotPasswordHash, user.id]
          )
            .then((result) => {
              if (result != null && result.changedRows > 0) {
                // Load the template
                const emailTemplate = replaceContent(
                  path.join(__dirname, '../public/email/forgotEmail.html'),
                  {
                    userEmail: user.email,
                    baseUrl,
                    emailToken: emailForgotPasswordHash,
                  }
                );

                // Send email to check if is a real email
                return sendEmail(
                  user.email,
                  'Forgot Password',
                  '',
                  emailTemplate
                )
                  .then(() => {
                    return `${baseUrl}/user/forgotPasswordForm?token=${emailForgotPasswordHash}`;
                  })
                  .catch((error) => {
                    throw error;
                  });
              } else {
                throw new Error('Internal Server Error');
              }
            })
            .catch((error) => {
              throw error;
            });
        } else {
          // User not found or already validated in the past
          return null;
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Validate if the recived has is valid and existsd
   * @param hash {string} Hash to user as filter
   * @return {bool}  Return true if the email validated and false if not
   */
  async validateForgotPassword(hash) {
    return await query(
      `${this.defaultSelectUser}
        WHERE 
            U.emailForgotPasswordHash = ?
            AND U.emailValidatedAt IS NOT NULL
            AND U.emailForgotPasswordExpires >= NOW()`,
      [hash]
    )
      .then((user) => {
        // Check if has result
        return user != null && user.length > 0;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Validate if the recived has is valid and existsd
   * @param hash {string} Hash to user as filter
   * @param email {string} User Email
   * @param password {string} User Password
   * @return {bool}  Return true if the email validated and false if not
   */
  async changeForgotPassword(hash, email, password) {
    return await query(
      `${this.defaultSelectUser}
        WHERE 
            U.emailForgotPasswordHash = ?
            AND U.email = ?
            AND U.emailValidatedAt IS NOT NULL
            AND U.emailForgotPasswordExpires >= NOW()`,
      [hash, email]
    )
      .then((user) => {
        // Check if has result
        if (user != null && user.length > 0) {
          return query(
            `UPDATE 
              tb_user
            SET 
              password = ?
              , emailForgotPasswordExpires = NOW()
            WHERE	
              id = ?`,
            [sha1(process.env.AUTH_SALT + password), user[0].id]
          )
            .then((result) => {
              return result != null && result.changedRows > 0;
            })
            .catch((error) => {
              throw error;
            });
        } else {
          throw new Error('Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export the service class
module.exports = UserService;
