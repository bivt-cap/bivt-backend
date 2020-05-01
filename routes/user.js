// Express - Router
const router = require('express').Router();

// Express - Validation (https://www.npmjs.com/package/express-validator)
const { check } = require('express-validator');

// Check if Express-Validtor returned an error
const { checkErrors, formatError500 } = require('../core/express/errors');

// Business Logic related to the Users
const UserService = require('../services/userService');

// Transportation Class
const Transport = require('../models/transport/transport');

/**
 * @api {post} /user/create Create a new user
 * @apiName /user/create
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {string} email Email
 * @apiParam {string} password Password
 * @apiParam {string} firstName First Name
 * @apiParam {string} lastName Last Name
 *
 * @apiSuccess {null} null There is no return
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *  "status": {
 *    "id": 200,
 *    "errors": null
 *  }
 * }
 *
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
  '/create',
  [
    check('email')
      .not()
      .isEmpty()
      .isEmail()
      .custom(async (value) => {
        const sUser = new UserService();
        await sUser.getUserByEmail(value).then((user) => {
          if (user) {
            return Promise.reject(new Error('E-mail already in use'));
          }
          return true;
        });
      })
      .withMessage('E-mail must be a valid e-mail.'),
    check('password').custom((value) => {
      // Password expresion that requires one lower case letter,
      // one upper case letter, one digit, 6-13 length, and no spaces.
      if (!value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,13}$/gm)) {
        return Promise.reject(
          new Error(
            'Password requires one lower case letter, one upper case letter, one digit, 6-13 length, and no spaces'
          )
        );
      }
      return true;
    }),
    check('firstName')
      .not()
      .isEmpty()
      .withMessage('First name cannot be empty.'),
    check('lastName').not().isEmpty().withMessage('Last name cannot be empty.'),
  ],
  checkErrors(),
  (req, res) => {
    // Get the values from the body
    const { email, password, firstName, lastName } = req.body;

    // Create the new user
    const sUser = new UserService();
    sUser
      .addNewUser(
        email,
        password,
        firstName,
        lastName,
        `${req.protocol}://${req.get('host')}`
      )
      .then((emailToken) => {
        // Internal server erroro
        if (emailToken == null) {
          throw new Error('Internal Server Error');
        }

        // Success
        return res.json(new Transport(200, null, { emailToken }));
      })
      .catch((error) => {
        return formatError500(res, error);
      });
  }
);

/*
 * Url: /user/validateEmail
 * Name /user/validateEmail
 * Group User
 * Version: 1.0.0
 *
 * Param: {string} token User email validation token
 *
 * Success: Success HTML PAGE
 * Erro: 404 Error HTML PAGE
 */
router.get(
  '/validateEmail',
  check('token').not().isEmpty().withMessage('Token cannot be empty.'),
  checkErrors(),
  (req, res) => {
    // Get the values from the querystring
    const { token } = req.query;

    // Execute the validation
    const sUser = new UserService();
    sUser
      .validateEmail(token)
      .then((result) => {
        // Internal server erroro
        if (result) {
          return res.render('checkEmail');
        }
        return res.render('404');
      })
      .catch(() => {
        return res.render('404');
      });
  }
);

/**
 * @api {post} /user/auth Authenticate user
 * @apiName /auth
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email Email
 * @apiParam {String} password Password
 *
 * @apiSuccess {string} token Authorization Token
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "errors": null,
 *     "id": 200
 *   },
 *   "data": {
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5..."
 *   }
 * }
 *
 * @apiError {422} UNPROCESSABLE_ENTITY The request was well-formed but was unable to be followed due to semantic errors.
 * @apiError {401} UNAUTHORIZED Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.
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
  '/auth',
  [
    check('email')
      .not()
      .isEmpty()
      .isEmail()
      .withMessage('E-mail must be a valid e-mail.'),
    check('password').custom((value) => {
      // Password expresion that requires one lower case letter,
      // one upper case letter, one digit, 6-13 length, and no spaces.
      if (!value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,13}$/gm)) {
        return Promise.reject(
          new Error(
            'Password requires one lower case letter, one upper case letter, one digit, 6-13 length, and no spaces'
          )
        );
      }
      return true;
    }),
  ],
  checkErrors(),
  (req, res) => {
    // Get the passwod and email from body
    const { email, password } = req.body;

    // Authenticate the User
    const sUser = new UserService();
    sUser
      .authenticate(email, password)
      .then((token) => {
        // Unauthorized
        if (token == null) {
          const transport = new Transport(401, 'Unauthorized', null);
          delete transport.data;
          return res.status(401).json(transport);
        }

        // Success
        return res.json(new Transport(200, null, token));
      })
      .catch((error) => {
        return formatError500(res, error);
      });
  }
);

// Export this router
module.exports = router;
