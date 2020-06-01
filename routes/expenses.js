// Express - Router
const router = require('express').Router();

// Password + JWT
const passport = require('passport');

// Express - Validation (https://www.npmjs.com/package/express-validator)
const { check } = require('express-validator');

// JWT Strategy
const jwtStrategy = require('../core/jwtStrategy');

passport.use(jwtStrategy);

// Check if Express-Validtor returned an error
const {
  mdwHasErrors,
  formatReturnError,
  ErrorReturnType,
} = require('../core/express/errors');

// Error Exception
const BvitError = require('../core/express/bvitError');

// Business Logic Layers
const ExpensesService = require('../services/expensesService');

// Transportation Class
const Transport = require('../models/transport/transport');

/**
 * @api {post} expenses/addBill Adds a new Bill
 * @apiDescription Adds a Bill
 * @apiName expenses/addBill
 * @apiGroup expenses
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {int} circleId Circle Id
 * @apiParam {string} billName Name of the bill
 * @apiParam {int} billAmount Amount off the bill
 * @apiParam {string} billCategory Category of the bill
 * @apiParam {date} billDate date of the bill
 * @apiParamExample {json} Request-Example:
 * {
    circleId: 1,
    billName: Lunch,
    billAmount: 100,
    billCategory: Food,
    billDate: 2015-03-25,
  }
 *
 * @apiSuccess {null} There is no result
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   }
 * }
 *
 * @apiError {400} BAD_REQUEST The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing.
 * @apiError {401} UNAUTHORIZED Authentication is required and has failed or has not yet been provided.
 * @apiError {404} NOT_FOUND The requested resource could not be found but may be available in the future.
 * @apiError {409} CONFLICT Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.
 * @apiError (Error 5xx) {500} INTERNAL_SERVER_ERROR A generic error message, given when an unexpected condition was encountered and no more specific message is suitable
 * @apiErrorExample {json} Example
 * HTTP/1.1 400 Bad Request
 * {
 *   "status": {
 *     "errors": [
 *       "Bad Request",
 *     ],
 *     "id": 400
 *   }
 * }
 *
 * -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
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
 * HTTP/1.1 404 Not Found
 * {
 *   "status": {
 *     "id": 404,
 *     "errors": [
 *       "Not Found"
 *     ]
 *   }
 * }
 *
 * -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 * HTTP/1.1 409 Conflict
 * {
 *   "status": {
 *     "id": 409,
 *     "errors": [
 *       "Conflict"
 *     ]
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
  '/addBill',
  [
    check('circleId', 'A valid circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check(
      'billName',
      'The bill must have a minimum of 3 characters and a maximum of 56 characters'
    ).isLength({ min: 3, max: 56 }),
    check('billAmount', 'A valid bill amount in CAD $ is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check('billCategory', 'Bill category is not valid').isLength({
      min: 3,
      max: 10,
    }),
    check('billDate').custom((value) => {
      if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error('Enter a valid date');
      } else {
        return true;
      }
    }),
  ],
  mdwHasErrors(),
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Get the values from the body
    const { billName, billAmount, billCategory, billDate, circleId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sExpensesService = new ExpensesService();

    // Add the Plugin to the Circle
    sExpensesService
      .addBill(
        circleId,
        authUser.id,
        billName,
        billAmount,
        billCategory,
        billDate
      )
      .then((resultId) => {
        if (resultId <= 0) {
          throw new BvitError(400, 'There was a problem saving the bill');
        } else {
          const transport = new Transport(200, null);
          delete transport.data;
          return res.json(transport);
        }
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);
// Export this router
module.exports = router;
