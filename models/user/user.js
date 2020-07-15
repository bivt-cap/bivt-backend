// SHA1 Encrypt
const sha1 = require('sha1');

// Node.JS module
const crypto = require('crypto');

// Configuration
const config = require('../../core/config');

// Database
const query = require('../../core/database');

// "Enum": since are not supported in JavaScript natively,
// I will create a const and freeze the object so nothing
// can be add to the object
const UserType = {
  Local: 0,
  Google: 1,
};
Object.freeze(UserType);

/*
 * User
 */
class User {
  constructor() {
    this.getDefaultSQL = `SELECT 
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
                              , U.type
                              , U.photoUrl
                              , U.dateOfBirth
                          FROM 
                              tb_user AS U
                          WHERE `;
  }

  getDefaultConvert(result) {
    // Check if has result
    if (result != null && result.length > 0) {
      // Return the User
      return {
        id: parseInt(result[0].id),
        extId: result[0].extId,
        email: result[0].email,
        password: result[0].password,
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        isBlocked: parseInt(result[0].isBlocked) === 1,
        emailValidationHash: result[0].emailValidationHash,
        emailValidatedOn: result[0].emailValidatedOn,
        emailForgotPasswordHash: result[0].emailForgotPasswordHash,
        type: parseInt(result[0].type) === 0 ? UserType.Local : UserType.Google,
        photoUrl: result[0].photoUrl,
        dateOfBirth: result[0].dateOfBirth,
      };
    } else {
      return null;
    }
  }

  /*
   * Find an user by Id
   * @param id {int} Find an user using the id to filter
   * @return {object} User
   */
  async getUserById(id) {
    return await query(
      `${this.getDefaultSQL}
            U.id = ?`,
      [id]
    )
      .then((result) => {
        return this.getDefaultConvert(result);
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Find an user by email
   * @param email {string} Find an user using this email to filter
   * @return {object} User
   */
  async getUserByEmail(email) {
    return await query(
      `${this.getDefaultSQL}
            U.email = ?`,
      [email]
    )
      .then((result) => {
        return this.getDefaultConvert(result);
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
      `${this.getDefaultSQL}
            U.extId = ?`,
      [extId]
    )
      .then((result) => {
        return this.getDefaultConvert(result);
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Find an user by Email Validation Hash
   * @param hash {string} Find an user using the Email Validation Hash
   * @return {User} User
   */
  async getUserByEmailValidationHash(hash) {
    return await query(
      `${this.getDefaultSQL}
            U.emailValidationHash = ?
            AND U.emailValidatedOn IS NULL
            AND U.emailValidationExpires >= NOW()`,
      [hash]
    )
      .then((result) => {
        return this.getDefaultConvert(result);
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Find an user by Email Forgot Hash
   * @param hash {string} Find an user using the Email Forgot Hash
   * @return {User} User
   */
  async getUserByForgotEmailHash(hash) {
    return await query(
      `${this.getDefaultSQL}
            U.emailForgotPasswordHash = ?
            AND U.emailValidatedOn IS NOT NULL
            AND U.emailForgotPasswordExpires >= NOW()`,
      [hash]
    )
      .then((result) => {
        return this.getDefaultConvert(result);
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Find an user by Email Forgot Hash
   * @param email {string} Find an user using the Email
   * @param hash {string} Find an user using the Email Forgot Hash
   * @return {User} User
   */
  async getUserByEmailAndForgotEmailHash(email, hash) {
    return await query(
      `${this.getDefaultSQL}
            U.emailForgotPasswordHash = ?
            AND U.email = ?
            AND U.emailValidatedOn IS NOT NULL
            AND U.emailForgotPasswordExpires >= NOW()`,
      [hash, email]
    )
      .then((result) => {
        return this.getDefaultConvert(result);
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
   * @param photoUrl {string} Photo Url
   * @param userType {UserType} Type of the user
   * @return {int} User Id
   */
  async addNewUser(email, password, firstName, lastName, photoUrl, userType) {
    // Create an email validation Hash
    const emailValidationHash = crypto.randomBytes(50).toString('hex');

    // Is a Local user
    if (userType === UserType.Local) {
      return await query(
        `INSERT INTO tb_user 
        (email, password, firstName, lastName, emailValidationHash, emailValidationExpires, photoUrl, type) 
        VALUES
        (?, ?, ?, ?, ?, NOW() + INTERVAL 1 DAY, ?, 0)`,
        [
          email,
          sha1(config.authorization.salt + password),
          firstName,
          lastName,
          emailValidationHash,
          photoUrl,
        ]
      )
        .then((result) => {
          return parseInt(result.insertId);
        })
        .catch((error) => {
          throw error;
        });
    } else if (userType === UserType.Google) {
      return await query(
        `INSERT INTO tb_user 
        (email, password, firstName, lastName, emailValidationHash, emailValidationExpires, emailValidatedOn, photoUrl, type) 
        VALUES
        (?, ?, ?, ?, ?, NOW(), NOW(), ?, 1)`,
        [
          email,
          sha1(
            config.authorization.salt + password + config.authorization.salt
          ),
          firstName,
          lastName,
          emailValidationHash,
          photoUrl,
        ]
      )
        .then((result) => {
          return parseInt(result.insertId);
        })
        .catch((error) => {
          throw error;
        });
    } else {
      throw Error('User Type not valid');
    }
  }

  /*
   * Set the user email as valid
   * @param id {int} Find an user using the id to filter
   * @return {object} User
   */
  async setUserEmailAsValid(userId) {
    return await query(
      `UPDATE
            tb_user
          SET
            emailValidatedOn = NOW()
            , emailValidationExpires = NOW()
          WHERE
            id = ?`,
      [userId]
    )
      .then((result) => {
        return result != null && result.changedRows > 0;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Regenerate email validation hash
   * @param id {int} Find an user using the id to filter
   * @return {bool} True or False
   */
  async regenerateEmailValidationHash(userId) {
    // Create an email validation Hash
    const emailValidationHash = crypto.randomBytes(50).toString('hex');

    // Update the information
    return await query(
      `UPDATE 
          tb_user
        SET 
          emailValidationHash = ?
          , emailValidationExpires = NOW() + INTERVAL 1 DAY
        WHERE
          id = ?`,
      [emailValidationHash, userId]
    )
      .then((result) => {
        return result != null && result.changedRows > 0
          ? emailValidationHash
          : null;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Generate forgot password hash
   * @param id {int} Find an user using the id to filter
   * @return {string} Hash
   */
  async generateForgotPasswordHash(userId) {
    // Create an email validation Hash
    const emailForgotPasswordHash = crypto.randomBytes(50).toString('hex');

    // Execut the update
    const result = await query(
      `UPDATE 
              tb_user
          SET 
            emailForgotPasswordHash = ?
            , emailForgotPasswordExpires = NOW() + INTERVAL 1 DAY
          WHERE
              id = ?`,
      [emailForgotPasswordHash, userId]
    );

    // Check if was executed
    if (result != null && result.changedRows > 0) {
      return emailForgotPasswordHash;
    } else {
      return null;
    }
  }

  /*
   * Update password and forgotpassordexpires
   * @param id {int} Find an user using the id to filter
   * @param password {string} new password
   * @return {User} User
   */
  async updatePasswordAndSetHasExpiresByUserId(userId, password) {
    const result = await query(
      `UPDATE 
        tb_user
      SET 
        password = ?
        , emailForgotPasswordExpires = NOW()
      WHERE	
        id = ?`,
      [sha1(config.authorization.salt + password), userId]
    );

    return result != null && result.changedRows > 0;
  }

  /*
   * Update password
   * @param id {int} Find an user using the id to filter
   * @param password {string} new password
   * @return {User} User
   */
  async updatePasswordByUserId(userId, password) {
    const result = await query(
      `UPDATE 
        tb_user
      SET 
        password = ?
      WHERE	
        id = ?`,
      [sha1(config.authorization.salt + password), userId]
    );

    return result != null && result.changedRows > 0;
  }
}

// Export
module.exports = { User, UserType };
