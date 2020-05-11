// SHA1 Encrypt
const sha1 = require('sha1');

// Node.JS module
const path = require('path');
const crypto = require('crypto');

// JWT
const jwt = require('jsonwebtoken');

// Configuration
const config = require('../core/config');

// Database
const query = require('../core/database');

// Send Email
const sendEmail = require('../core/sendEmail');

// Replace content from a file
const replaceContent = require('../core/replaceContent');

// Models
const User = require('../models/user/user');
const AuthToken = require('../models/auth/authToken');

// Custom Exception
const BvitError = require('../core/express/bvitError');

// Business Logic related to the Circle
const CircleService = require('./circleService');

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
        , CASE WHEN U.emailValidatedOn IS NULL THEN 1 ELSE 0 END AS isBlocked
        , U.emailValidationHash
        , U.emailValidatedOn
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
      resultDB[0].emailValidatedOn,
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
   * Find an user by External Id
   * @param extId {string} Find an user using the external id
   * @return {User} User
   */
  async getUserByExtId(extId) {
    return await query(
      `${this.defaultSelectUser}
        WHERE 
            U.extId = ?`,
      [extId]
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
        sha1(config.authorization.salt + password),
        firstName,
        lastName,
        emailValidationHash,
      ]
    )
      .then((result) => {
        if (result != null) {
          return parseInt(result.insertId);
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .then((userId) => this.getUserById(userId))
      .then((user) => {
        if (user !== null && user.id > 0) {
          return user;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .then(async (user) => {
        const sCircle = new CircleService();
        await sCircle.updateInviteWithUserIdByEmail(user.email, user.id);
        return user;
      })
      .then((user) => this.sendValidationEmail(user, baseUrl))
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
    return await sendEmail(user.email, 'Verify your account', '', emailTemplate)
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
          return user;
        } else {
          throw new BvitError(
            404,
            'User not found or already validated in the past.'
          );
        }
      })
      .then(async (user) => {
        // Create an email validation Hash
        // eslint-disable-next-line no-param-reassign
        user.emailValidationHash = crypto.randomBytes(50).toString('hex');

        // Update the user with a new hash and expiration date
        const result = await query(
          `UPDATE 
                tb_user
              SET 
                emailValidationHash = ?
                , emailValidationExpires = NOW() + INTERVAL 1 DAY
              WHERE
                id = ?`,
          [user.emailValidationHash, user.id]
        );

        if (result != null && result.changedRows > 0) {
          return user;
        } else {
          throw new BvitError(
            404,
            'User not found or already validated in the past.'
          );
        }
      })
      .then((user) => this.sendValidationEmail(user, baseUrl))
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
            AND U.emailValidatedOn IS NULL
            AND U.emailValidationExpires >= NOW()`,
      [hash]
    )
      .then((user) => {
        // Check if has result
        if (user != null && user.length > 0) {
          return user[0].id;
        } else {
          throw new BvitError(404, 'The token is invalid or has expired');
        }
      })
      .then(async (userId) => {
        return await query(
          `UPDATE
                tb_user
              SET
              emailValidatedOn = NOW()
                , emailValidationExpires = NOW()
              WHERE
                id = ?`,
          [userId]
        );
      })
      .then((result) => {
        if (result != null && result.changedRows > 0) {
          return true;
        } else {
          throw new BvitError(404, 'The token is invalid or has expired');
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
          user.password === sha1(config.authorization.salt + password)
        ) {
          // Generate the token
          const token = jwt.sign(
            {
              extId: user.extId,
            },
            config.authorization.secret,
            {
              // Token expires in 24 hour
              expiresIn: 3600 * 24,
            }
          );

          // return the token
          return new AuthToken(token);
        } else {
          throw new BvitError(401, 'Unauthorized');
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
          return user;
        } else {
          throw new BvitError(404, 'User not found.');
        }
      })
      .then(async (user) => {
        // Create an email validation Hash
        // eslint-disable-next-line no-param-reassign
        const emailForgotPasswordHash = crypto.randomBytes(50).toString('hex');

        // Update the user with a new hash and expiration date
        const result = await query(
          `UPDATE 
                  tb_user
              SET 
                emailForgotPasswordHash = ?
                , emailForgotPasswordExpires = NOW() + INTERVAL 1 DAY
              WHERE
                  id = ?`,
          [emailForgotPasswordHash, user.id]
        );

        // Check if was executed
        if (result != null && result.changedRows > 0) {
          return { user, emailForgotPasswordHash };
        } else {
          throw new BvitError(404, 'User not found.');
        }
      })
      .then(async (result) => {
        // Load the template
        const emailTemplate = replaceContent(
          path.join(__dirname, '../public/email/forgotEmail.html'),
          {
            userEmail: result.user.email,
            baseUrl,
            emailToken: result.emailForgotPasswordHash,
          }
        );

        // Send email to check if is a real email
        await sendEmail(
          result.user.email,
          'Forgot Password',
          '',
          emailTemplate
        );

        return `${baseUrl}/user/forgotPasswordForm?token=${result.emailForgotPasswordHash}`;
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
            AND U.emailValidatedOn IS NOT NULL
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
  async changeForgotPasswordByHash(hash, email, password) {
    return await query(
      `${this.defaultSelectUser}
        WHERE 
            U.emailForgotPasswordHash = ?
            AND U.email = ?
            AND U.emailValidatedOn IS NOT NULL
            AND U.emailForgotPasswordExpires >= NOW()`,
      [hash, email]
    )
      .then((user) => {
        // Check if has result
        if (user != null && user.length > 0) {
          return user[0];
        } else {
          throw new BvitError(404, 'The token is invalid or has expired');
        }
      })
      .then(async (user) => {
        return await query(
          `UPDATE 
            tb_user
          SET 
            password = ?
            , emailForgotPasswordExpires = NOW()
          WHERE	
            id = ?`,
          [sha1(config.authorization.salt + password), user.id]
        );
      })
      .then((result) => {
        return result != null && result.changedRows > 0;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Validate if the recived has is valid and existsd
   * @param id {int} User Id
   * @param password {string} User Password
   * @return {bool}  Return true if id was updated
   */
  async changeForgotPasswordById(id, password) {
    return await query(
      `UPDATE 
              tb_user
            SET 
              password = ?
            WHERE	
              id = ?`,
      [sha1(config.authorization.salt + password), id]
    )
      .then((result) => {
        return result != null && result.changedRows > 0;
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export the service class
module.exports = UserService;
