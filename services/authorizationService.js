// Google API Client Library
const { OAuth2Client } = require('google-auth-library');

// SHA1 Encrypt
const sha1 = require('sha1');

// JWT
const jwt = require('jsonwebtoken');

// Configuration
const config = require('../core/config');

// Custom Exception
const BvitError = require('../core/express/bvitError');

// Model
const { User, UserType } = require('../models/user/user');

/*
 * Business Logic related to the User
 */
class AuthorizationService {
  constructor() {
    this.UserModel = new User();
  }

  /*
   * Authenticate the user
   * @param email {string} User Email
   * @param password {string} User Password
   * @return {AuthToken} Return the Authorization Token
   */
  async authenticate(email, password) {
    // Find the user using the email as filter
    return await this.UserModel.getUserByEmail(email)
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
              expiresIn: 3600 * 24 * 31,
            }
          );

          // return the token
          return {
            token,
            user: {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              photoUrl: user.photoUrl,
              dateOfBirth: user.dateOfBirth,
              type: user.type,
            },
          };
        } else {
          throw new BvitError(401, 'Unauthorized');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Verify the integrity of the ID token
   * @param tokenId {string} Google Token Id
   * @return {object} Ticket Payload
   */
  async gTokenVerify(tokenId) {
    const audienceId = config.authorization.googleClientId;
    const client = new OAuth2Client(audienceId);
    return await client
      .verifyIdToken({
        idToken: tokenId,
        audience: audienceId,
      })
      .then((ticket) => {
        const payload = ticket.getPayload();
        return {
          id: payload.sub,
          email: payload.email,
          fistName: payload.given_name,
          lastName: payload.family_name,
          photoUrl: payload.picture,
        };
      })
      .then(async (payload) => {
        return {
          payload,
          user: await this.UserModel.getUserByEmail(payload.email),
        };
      })
      .then(async (result) => {
        if (result.user != null) {
          // Check if the user is a google account
          if (result.user.type !== UserType.Google) {
            throw new BvitError(403, 'User already exists with this email.');
          } else {
            return result;
          }
        } else {
          // Create a new user
          const userId = await this.UserModel.addNewUser(
            result.payload.email,
            result.payload.id,
            result.payload.fistName,
            result.payload.lastName,
            result.payload.photoUrl,
            UserType.Google
          );

          return {
            payload: result.payload,
            user: await this.UserModel.getUserById(userId),
          };
        }
      })
      .then(async (result) => {
        const { payload, user } = result;

        // Do the authentication
        // Check if a user was found
        // Check if the user is not blocked
        // Check if password is equals
        if (
          user != null &&
          !user.isBlocked &&
          user.password ===
            sha1(
              config.authorization.salt + payload.id + config.authorization.salt
            )
        ) {
          // Generate the token
          const token = jwt.sign(
            {
              extId: user.extId,
            },
            config.authorization.secret,
            {
              // Token expires in 24 hour
              expiresIn: 3600 * 24 * 31,
            }
          );

          // return the token
          return {
            token,
            user: {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              photoUrl: user.photoUrl,
              dateOfBirth: user.dateOfBirth,
              type: user.type,
            },
          };
        } else {
          return null;
        }
      })
      .catch((error) => {
        if (error instanceof BvitError) {
          throw error;
        } else {
          throw new BvitError(401, 'Unauthorized');
        }
      });
  }
}

// Export the service class
module.exports = AuthorizationService;
