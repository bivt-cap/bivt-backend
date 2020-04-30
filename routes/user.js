// Express - Router
const router = require('express').Router();

// Express - Validation (https://www.npmjs.com/package/express-validator)
const { check, validationResult } = require('express-validator');

// Business Logic related to the Users
const UserService = require('../services/userService');

// Transportation Class
const Transport = require('../models/transport/transport');

/**
 * @api {post} /user/create Create a new User
 * @apiName /user/create
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {string} email Email (User Name)
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
 *  },
 *  "data": null
 * }
 *
 * @apiError (Error) {422} Unprocessable Entity
 * @apiError (Error) {500} Internal Server Error
 * @apiErrorExample {json} Example
 * HTTP/1.1 422 Unprocessable Entity
 * {
 *   "status": {
 *     "errors": [
 *       "E-mail already in use",
 *       "Password requires one lower case letter, one upper case letter, one digit, 6-13 length, and no spaces",
 *     ],
 *     "id": 422
 *   },
 *   "data": null
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
 *   },
 *   "data": null
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
  (req, res) => {
    // Check for erros
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(
        new Transport(
          422,
          errors.array().map((e) => {
            return e.msg;
          }),
          null
        )
      );
    }

    // Get the values from the body
    const { email, password, firstName, lastName } = req.body;

    // Create the new user
    const sUser = new UserService();
    sUser
      .addNewUser(email, password, firstName, lastName)
      .then((extId) => {
        // Internal server erroro
        if (extId == null) {
          throw new Error('Internal Server Error');
        }

        // Success
        return res.json(new Transport(200, null, null));
      })
      .catch((error) => {
        return res
          .status(500)
          .json(
            new Transport(
              500,
              error.message !== 'undefined'
                ? error.message
                : 'Internal Server Error',
              null
            )
          );
      });
  }
);

// Export this router
module.exports = router;
