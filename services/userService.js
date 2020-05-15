// Node.JS module
const path = require('path');

// Send Email
const sendEmail = require('../core/sendEmail');

// Replace content from a file
const replaceContent = require('../core/replaceContent');

// Models
const { User, UserType } = require('../models/user/user');

// Custom Exception
const BvitError = require('../core/express/bvitError');

// Business Logic related to the Circle
const CircleService = require('./circleService');

/*
 * Business Logic related to the User
 */
class UserService {
  constructor() {
    this.UserModel = new User();
  }

  /*
   * Find an user by email
   * @param email {string} Find an user using this email to filter
   * @return {object} User
   */
  async getUserByEmail(email) {
    return await this.UserModel.getUserByEmail(email);
  }

  /*
   * Find an user by Id
   * @param id {int} Find an user using the id to filter
   * @return {object} User
   */
  async getUserById(id) {
    return await this.UserModel.getUserById(id);
  }

  /*
   * Find an user by External Id
   * @param extId {string} Find an user using the external id
   * @return {User} User
   */
  async getUserByExtId(extId) {
    return await this.UserModel.getUserByExtId(extId);
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
    return await this.UserModel.addNewUser(
      email,
      password,
      firstName,
      lastName,
      null,
      UserType.Local
    )
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
        if (user !== null && user.emailValidatedOn === null) {
          return user;
        } else {
          throw new BvitError(
            404,
            'User not found or already validated in the past.'
          );
        }
      })
      .then(async (user) => {
        if (this.UserModel.regenerateEmailValidationHash(user.id)) {
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
    return await this.UserModel.getUserByEmailValidationHash(hash)
      .then((user) => {
        // Check if has result
        if (user != null) {
          return user.id;
        } else {
          throw new BvitError(404, 'The token is invalid or has expired');
        }
      })
      .then(async (userId) => {
        if (await this.UserModel.setUserEmailAsValid(userId)) {
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
        // Update the user with a new hash and expiration date
        const emailForgotPasswordHash = await this.UserModel.generateForgotPasswordHash(
          user.id
        );

        // Check if was executed
        if (emailForgotPasswordHash != null) {
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
   * Validate if the recived hash is valid and existsd
   * @param hash {string} Hash to user as filter
   * @return {bool}  Return true if the email validated and false if not
   */
  async validateForgotPassword(hash) {
    return await this.UserModel.getUserByForgotEmailHash(hash)
      .then((user) => {
        // Check if has result
        return user != null;
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
    return await this.UserModel.getUserByEmailAndForgotEmailHash(email, hash)
      .then((user) => {
        // Check if has result
        if (user != null) {
          return user;
        } else {
          throw new BvitError(404, 'The token is invalid or has expired');
        }
      })
      .then(async (user) => {
        return await this.UserModel.updatePasswordAndSetHasExpiresByUserId(
          user.id,
          password
        );
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
    return await this.UserModel.updatePasswordByUserId(id, password)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export the service class
module.exports = UserService;
