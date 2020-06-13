// Express - Router
const router = require('express').Router();

// Password + JWT
const passport = require('passport');

// Express - Validation (https://www.npmjs.com/package/express-validator)
const { check } = require('express-validator');

// Check if Express-Validtor returned an error
const {
  mdwHasErrors,
  formatReturnError,
  ErrorReturnType,
} = require('../core/express/errors');

// utility
const { checkIfIsValidPassword } = require('../core/express/validations');

// Business Logic related to the Users
const AuthorizationService = require('../services/authorizationService');
const UserService = require('../services/userService');

// Transportation Class
const Transport = require('../models/transport/transport');

/**
 * @api {post} /auth/local Authenticate user
 * @apiDescription Authenticate user through received email (username) and password
 * @apiName /auth/local
 * @apiGroup Auth
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} content-type application/json
 * @apiHeaderExample Header-Example:
 * content-type: application/json
 *
 * @apiParam {String} email Email
 * @apiParam {String} password Password
 * @apiParamExample {json} Request-Example:
 * {
 *  "email": "email@email.com",
 *  "password": "1234567890"
 * }
 *
 * @apiSuccess {string} token Authorization Token
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   },
 *   "data": {
 *     "token": "eyJhbGciOiJIU...",
 *     "user": {
 *       "email": "email@email.com",
 *       "firstName": "First Name",
 *       "lastName": "Last Name",
 *       "photoUrl": "Profile Photo URL",
 *       "dateOfBirth": "2014-01-01T23:28:56.782Z",
 *       "type": 0
 *     }
 *   }
 * }
 */
router.post(
  '/local',
  [
    check('email', 'E-mail must be a valid e-mail.').not().isEmpty().isEmail(),
    check('password').custom((value) => {
      return checkIfIsValidPassword(value);
    }),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the passwod and email from body
    const { email, password } = req.body;

    // Authenticate the User
    const sAuth = new AuthorizationService();
    sAuth
      .authenticate(email, password)
      .then((token) => {
        // Success
        return res.json(new Transport(200, null, token));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {post} /auth/google Google authenticate user
 * @apiDescription Authenticate user through google
 * @apiName /auth/google
 * @apiGroup Auth
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} content-type application/json
 * @apiHeaderExample Header-Example:
 * content-type: application/json
 *
 * @apiParam {string} token Google Token
 * @apiParamExample {json} Request-Example:
 * {
 *  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
 * }
 *
 * @apiSuccess {string} token Authorization Token
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   },
 *   "data": {
 *     "token": "eyJhbGciOiJIU...",
 *     "user": {
 *       "email": "email@email.com",
 *       "firstName": "First Name",
 *       "lastName": "Last Name",
 *       "photoUrl": "Profile Photo URL",
 *       "dateOfBirth": "2014-01-01T23:28:56.782Z",
 *       "type": 1
 *     }
 *   }
 * }
 */
router.post(
  '/google',
  check('token', 'Google Token is required.').not().isEmpty(),
  mdwHasErrors(),
  (req, res) => {
    // Get the token
    const { token } = req.body;

    // Authenticate the User
    const sAuth = new AuthorizationService();
    sAuth
      .gTokenVerify(token)
      .then((result) => {
        return res.json(new Transport(200, null, result));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {get} /auth/check Check if a Token is valid
 * @apiDescription Check if a Token is valid
 * @apiName /auth/check
 * @apiGroup Auth
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...
 * content-type: application/json
 *
 * @apiSuccess {string} token Authorization Token
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   }
 * }
 */
router.get(
  '/check',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //  Authenticated user
    const authUser = req.user;

    // User information
    const sUser = new UserService();
    sUser
      .getUserByExtId(authUser.extId)
      .then((user) => {
        return res.json(
          new Transport(200, null, {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            photoUrl: user.photoUrl,
            dateOfBirth: user.dateOfBirth,
            type: user.type,
          })
        );
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

// Export this router
module.exports = router;
