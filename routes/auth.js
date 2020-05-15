// Express - Router
const router = require('express').Router();

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

 *
 * @apiError {401} UNAUTHORIZED Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.
 * @apiError {422} UNPROCESSABLE_ENTITY The request was well-formed but was unable to be followed due to semantic errors.
 * @apiError (Error 5xx) {500} INTERNAL_SERVER_ERROR A generic error message, given when an unexpected condition was encountered and no more specific message is suitable
 * @apiErrorExample {json} Example
 * HTTP/1.1 422 Unprocessable Entity
 * {
 *   "status": {
 *     "errors": [
 *       "E-mail already in use",
 *       "Password requires one lower case letter, one upper case letter, one digit, 6-13 length, and no spaces",
 *     ],
 *     "id": 422
 *   }
 * }
 *
 * -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 * HTTP/1.1 401 Unauthorized
 * {
 *   "status": {
 *     "errors": [
 *       "Unauthorized"
 *     ],
 *     "id": 401
 *   }
 * }
 *
 * -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "status": {
 *     "errors": [
 *       "Internal Server Error"
 *     ],
 *     "id": 500
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
 *
 * @apiError {401} UNAUTHORIZED Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.
 * @apiError {422} UNPROCESSABLE_ENTITY The request was well-formed but was unable to be followed due to semantic errors.
 * @apiError (Error 5xx) {500} INTERNAL_SERVER_ERROR A generic error message, given when an unexpected condition was encountered and no more specific message is suitable
 * @apiErrorExample {json} Example
 * HTTP/1.1 422 Unprocessable Entity
 * {
 *   "status": {
 *     "id": 422,
 *     "errors": [
 *       "Google Token is required."
 *     ]
 *   }
 * }
 *
 * -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 * HTTP/1.1 401 Unauthorized
 * {
 *   "status": {
 *     "errors": [
 *       "Unauthorized"
 *     ],
 *     "id": 401
 *   }
 * }
 *
 * -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "status": {
 *     "errors": [
 *       "Internal Server Error"
 *     ],
 *     "id": 500
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

// Export this router
module.exports = router;
