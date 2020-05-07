// Express - Router
const router = require('express').Router();

// Password + JWT
const passport = require('passport');

// Express - Validation (https://www.npmjs.com/package/express-validator)
const { check, validationResult } = require('express-validator');

// JWT Strategy
const jwtStrategy = require('../core/jwtStrategy');

passport.use(jwtStrategy);

// Check if Express-Validtor returned an error
const {
  checkErrors,
  formatError500Json,
  formatError500Html,
} = require('../core/express/errors');

// utility
const { checkIfIsValidEmail } = require('../core/express/customValidation');

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
    check('email', 'E-mail must be a valid e-mail.')
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
      }),
    check('password').custom((value) => {
      return checkIfIsValidEmail(value);
    }),
    check('firstName', 'First name cannot be empty.').not().isEmpty(),
    check('lastName', 'Last name cannot be empty.').not().isEmpty(),
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
        return formatError500Json(res, error);
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
 * Erro: 404 Error HTML PAGE
 */
router.get(
  '/validateEmail',
  check('token', 'Token cannot be empty.').not().isEmpty(),
  (req, res) => {
    // Check for erros Custom because is a web page
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return formatError500Html(res, errors);
    }

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
      .catch((error) => {
        return formatError500Html(res, error);
      });
  }
);

/**
 * @api {post} /user/auth Authenticate user
 * @apiName /user/auth
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
    check('email', 'E-mail must be a valid e-mail.').not().isEmpty().isEmail(),
    check('password').custom((value) => {
      return checkIfIsValidEmail(value);
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
        return formatError500Json(res, error);
      });
  }
);

/**
 * @api {post} /user/resendValidationEmail Resend a Validation Email
 * @apiName /user/resendValidationEmail
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email Email
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
  '/resendValidationEmail',
  [check('email', 'E-mail must be a valid e-mail.').not().isEmpty().isEmail()],
  checkErrors(),
  (req, res) => {
    // Get the passwod and email from body
    const { email } = req.body;

    // Authenticate the User
    const sUser = new UserService();
    sUser
      .resendValidationEmail(email, `${req.protocol}://${req.get('host')}`)
      .then((emailToken) => {
        // Internal server erroro
        if (emailToken == null) {
          throw new Error('Internal Server Error');
        }

        // Success
        return res.json(new Transport(200, null, { emailToken }));
      })
      .catch((error) => {
        return formatError500Json(res, error);
      });
  }
);

/**
 * @api {post} /user/forgotPassword Forgot Password
 * @apiName /user/forgotPassword
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email Email
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
  '/forgotPassword',
  [check('email', 'E-mail must be a valid e-mail.').not().isEmpty().isEmail()],
  checkErrors(),
  (req, res) => {
    // Get the passwod and email from body
    const { email } = req.body;

    // Authenticate the User
    const sUser = new UserService();
    sUser
      .forgotPassword(email, `${req.protocol}://${req.get('host')}`)
      .then((emailToken) => {
        // Internal server erroro
        if (emailToken == null) {
          throw new Error('Internal Server Error');
        }

        // Success
        return res.json(new Transport(200, null, { emailToken }));
      })
      .catch((error) => {
        return formatError500Json(res, error);
      });
  }
);

/*
 * Url: /user/forgotPasswordForm
 * Name /user/forgotPasswordForm
 * Group User
 * Version: 1.0.0
 *
 * Param: {string} token used to find the user how request to change
 *
 * Success: Success HTML PAGE
 * Erro: 404 Error HTML PAGE
 * Erro: 404 Error HTML PAGE
 */
router.get(
  '/forgotPasswordForm',
  check('token', 'Token cannot be empty.').not().isEmpty(),
  (req, res) => {
    // Check for erros Custom because is a web page
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return formatError500Html(res, errors);
    }

    // Get the values from the querystring
    const { token } = req.query;

    // Execute the validation
    const sUser = new UserService();
    sUser
      .validateForgotPassword(token)
      .then((result) => {
        if (result) {
          return res.render('forgotPasswordForm', { token, feedbackError: '' });
        }
        return res.render('404');
      })
      .catch((error) => {
        return formatError500Html(res, error);
      });
  }
);

/*
 * Url: /user/forgotPasswordChange
 * Name /user/forgotPasswordChange
 * Group User
 * Version: 1.0.0
 *
 * Param: {string} token used to find the user how request to change
 * Param: {string} email user email
 * Param: {string} password user password
 *
 * Success: Success HTML PAGE
 * Erro: 404 Error HTML PAGE
 * Erro: 500 Error HTML PAGE
 */
router.post(
  '/forgotPasswordChange',
  [
    check('token', 'Token cannot be empty.').not().isEmpty(),
    check('email', 'E-mail must be a valid e-mail.').not().isEmpty().isEmail(),
    check('password').custom((value) => {
      return checkIfIsValidEmail(value);
    }),
  ],
  (req, res) => {
    // Get the values from the querystring
    const { token, email, password } = req.body;

    // Check for erros Custom because is a web page
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorUnique = [
        ...new Set(
          errors.array().map((e) => {
            return e.msg;
          })
        ),
      ];

      return res.render('forgotPasswordForm', {
        token,
        feedbackError: `<ul>${errorUnique
          .map((e) => {
            return `<li>${e}</li>`;
          })
          .join('')}</ul>`,
      });
    }

    // Execute the validation
    const sUser = new UserService();
    sUser
      .changeForgotPasswordByHash(token, email, password)
      .then((result) => {
        if (result) {
          return res.render('forgotPasswordSuccess', { token });
        } else {
          return res.render('404');
        }
      })
      .catch((error) => {
        return formatError500Html(res, error);
      });
  }
);

/**
 * @api {post} /user/chagePassword Change user password
 * @apiName /user/chagePassword
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization Bearer Authorization token.
 *
 * @apiParam {String} password Password
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
 * @apiError {401} UNAUTHORIZED Authentication is required and has failed or has not yet been provided.
 * @apiError {422} UNPROCESSABLE_ENTITY The request was well-formed but was unable to be followed due to semantic errors.
 * @apiError (Error 5xx) {500} INTERNAL_SERVER_ERROR A generic error message, given when an unexpected condition was encountered and no more specific message is suitable
 * @apiErrorExample {json} Example
 * HTTP/1.1 401 Unauthorized
 * {
 *   "status": {
 *     "errors": [
 *       "Unauthorized",
 *     ],
 *     "id": 401
 *   }
 * }
 *
 * -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 * HTTP/1.1 422 Unprocessable Entity
 * {
 *   "status": {
 *     "errors": [
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
  '/chagePassword',
  passport.authenticate('jwt', { session: false }),
  check('password').custom((value) => {
    return checkIfIsValidEmail(value);
  }),
  (req, res) => {
    // Get the passwod and email from body
    const { password } = req.body;

    // Change the password
    const sUser = new UserService();
    sUser
      .changeForgotPasswordById(req.user.id, password)
      .then(() => {
        const transport = new Transport(200, null, null);
        delete transport.data;
        return res.json(transport);
      })
      .catch((error) => {
        return formatError500Json(res, error);
      });
  }
);

// Export this router
module.exports = router;
