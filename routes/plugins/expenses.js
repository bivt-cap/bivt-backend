// Express - Router
const router = require('express').Router();

// Password + JWT
const passport = require('passport');

// Express - Validation (https://www.npmjs.com/package/express-validator)
const { check } = require('express-validator');

// utility
const { checkIfUserBelongsCircle } = require('../../core/express/validations');

// JWT Strategy
const jwtStrategy = require('../../core/jwtStrategy');

passport.use(jwtStrategy);

// Check if Express-Validtor returned an error
const {
  mdwHasErrors,
  formatReturnError,
  ErrorReturnType,
} = require('../../core/express/errors');

// Error Exception
const BvitError = require('../../core/express/bvitError');

// Business Logic Layers
const ExpensesService = require('../../services/plugins/expensesService');

// Transportation Class
const Transport = require('../../models/transport/transport');

/**
 * @api {get}  /plugin/expenses/billCategories List of all the bill categories
 * @apiDescription Return the list of all the available bill categories
 * @apiName /plugin/expenses/billCategories
 * @apiGroup Expenses
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiSuccess {array} categories List of Categories
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   },
 *   "data": {
 *     "categories": [
 *       {
 *         "id": 1,
 *         "name": "Food",
 *       },
 *       {
 *         "id": 2,
 *         "name": "Other",
 *       }
 *     ]
 *   }
 * }
 *
 * @apiError {401} UNAUTHORIZED Authentication is required and has failed or has not yet been provided.
 * @apiError {404} NOT_FOUND The requested resource could not be found but may be available in the future.
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
 * HTTP/1.1 422 Unprocessable Entity
 * {
 *   "status": {
 *     "errors": [
 *       "The name must have a minimum of 3 characters and a maximum of 56 characters",
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
router.get(
  '/billCategories',
  passport.authenticate('jwt', { session: false }),
  mdwHasErrors(),
  (req, res) => {
    // Service Layer
    const sExpensesService = new ExpensesService();

    // get all bill categories
    sExpensesService
      .getBillCategories()
      .then((result) => {
        if (result === null) {
          throw new BvitError(400, 'There was a problem fetching categories.');
        }
        return res.json(new Transport(200, null, { categories: result }));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {post}  /plugin/expenses/bills List of all the bills
 * @apiDescription Return the list of all the available bills
 * @apiName /plugin/expenses/bills
 * @apiGroup Expenses
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {id} circleId circle ID
 * @apiParamExample {json} Request-Example:
 * {
 *   circleId: 1,
 * }
 *
 * @apiSuccess {array} bills List of bills
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   },
 *   "data": {
 *     "bills": [
 *       {
 *         "id": 1,
 *         "billName": "Car repair",
 *         "billAmount": 100,
 *         "billCategory": 5,
 *         "billDate": "2020-06-02T01:57:24.000Z"
 *       },
 *     ]
 *   }
 * }
 *
 * @apiError {401} UNAUTHORIZED Authentication is required and has failed or has not yet been provided.
 * @apiError {404} NOT_FOUND The requested resource could not be found but may be available in the future.
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
 * HTTP/1.1 422 Unprocessable Entity
 * {
 *   "status": {
 *     "errors": [
 *       "The name must have a minimum of 3 characters and a maximum of 56 characters",
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
  '/bills',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'A valid circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { circleId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sExpensesService = new ExpensesService();

    // get all bills
    sExpensesService
      .getBills(authUser.id, circleId)
      .then((result) => {
        if (result === null) {
          throw new BvitError(400, 'There was a problem fetching bills.');
        }
        return res.json(new Transport(200, null, { bills: result }));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {post} /plugin/expenses/addBill Adds a new Bill
 * @apiDescription Adds a Bill
 * @apiName  /plugin/expenses/addBill
 * @apiGroup Expenses
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
 * @apiParam {id} billCategory Category of the bill
 * @apiParam {date} billDate date of the bill
 * @apiParamExample {json} Request-Example:
 * {
 *   circleId: 1,
 *   billName: Lunch,
 *   billAmount: 100,
 *   billCategory: 1,
 *   billDate: 2015-03-25,
 * }
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
    check('billAmount', 'A valid bill amount in is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toFloat(),
    check('billCategory', 'Bill category is not valid')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check('billDate').custom((value) => {
      if (!value.match(/^\d{4}-\d{2}-\d{2}.*/)) {
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

    // Add the bill to DB
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

/**
 * @api {post}  /plugin/expenses/removeBill Removes bill
 * @apiDescription Removes a bill based on the bill id
 * @apiName /plugin/expenses/removeBill
 * @apiGroup Expenses
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParamExample {json} Request-Example:
 * {
 *   circleId: 1,
 *   billId: 1,
 * }
 *
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   }
 * }
 *
 * @apiError {401} UNAUTHORIZED Authentication is required and has failed or has not yet been provided.
 * @apiError {404} NOT_FOUND The requested resource could not be found but may be available in the future.
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
 * HTTP/1.1 422 Unprocessable Entity
 * {
 *   "status": {
 *     "errors": [
 *       "The name must have a minimum of 3 characters and a maximum of 56 characters",
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
  '/removebill',
  passport.authenticate('jwt', { session: false }),
  [
    check('billId', 'A valid Bill Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check('circleId', 'A valid circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { billId, circleId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sExpensesService = new ExpensesService();

    // delete a bill
    sExpensesService
      .removeBill(authUser.id, billId, circleId)
      .then((resultId) => {
        if (resultId <= 0) {
          throw new BvitError(400, 'There was a problem deleting the bill');
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

// ***************************************************************//
/**
 * APIS concerning the budget below:
 */
// ***************************************************************//

/**
 * @api {post} /plugin/expenses/addBudget Adds a new Budget
 * @apiDescription Adds a Budget
 * @apiName  /plugin/expenses/addBudget
 * @apiGroup Expenses
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
 * @apiParam {string} budgetName Name of the budget
 * @apiParam {int} budgetAmount Amount of the budget
 * @apiParam {date} budgetStartDate start date of the budget
 * @apiParam {date} billEndDate end date of the budget
 * @apiParamExample {json} Request-Example:
 * {
 *   circleId: 1,
 *   budgetName: Food,
 *   budgetAmount: 1000,
 *   budgetStartDate: 2020-06-15 12:13:04,
 *   budgetEndDate: 2020-07-15 12:13:04,
 * }
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
  '/addBudget',
  [
    check('circleId', 'A valid circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check(
      'budgetName',
      'The budget must have a minimum of 3 characters and a maximum of 56 characters'
    ).isLength({ min: 3, max: 56 }),
    check('budgetAmount', 'A valid budget amount is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toFloat(),
    check('budgetStartDate').custom((value) => {
      if (!value.match(/^\d{4}-\d{2}-\d{2}.*/)) {
        throw new Error('Enter a valid start date');
      } else {
        return true;
      }
    }),
    check('budgetEndDate').custom((value) => {
      if (!value.match(/^\d{4}-\d{2}-\d{2}.*/)) {
        throw new Error('Enter a valid end date');
      } else {
        return true;
      }
    }),
  ],
  mdwHasErrors(),
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Get the values from the body
    const {
      circleId,
      budgetName,
      budgetAmount,
      budgetStartDate,
      budgetEndDate,
    } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sExpensesService = new ExpensesService();

    // Call service to add budget to DB
    sExpensesService
      .addBudget(
        circleId,
        authUser.id,
        budgetName,
        budgetAmount,
        budgetStartDate,
        budgetEndDate
      )
      .then((resultId) => {
        if (resultId <= 0) {
          throw new BvitError(400, 'There was a problem saving the budget');
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

/**
 * @api {post}  /plugin/expenses/budgets List of all the budgets
 * @apiDescription Return the list of all the available budgets
 * @apiName /plugin/expenses/budgets
 * @apiGroup Expenses
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {id} circleId circle ID
 * @apiParamExample {json} Request-Example:
 * {
 *   circleId: 1,
 * }
 *
 * @apiSuccess {array} bills List of budgets
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   },
 *   "data": {
 *     "budgets": [
 *       {
 *         "id": 1,
 *         "budgetName": "Food",
 *         "budgetAmount": 100,
 *         "budgetStartDate": 2020-06-15 12:13:04,
 *         "budgetEndDate": 2020-07-15 12:13:04,
 *       },
 *     ]
 *   }
 * }
 *
 * @apiError {401} UNAUTHORIZED Authentication is required and has failed or has not yet been provided.
 * @apiError {404} NOT_FOUND The requested resource could not be found but may be available in the future.
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
 * HTTP/1.1 422 Unprocessable Entity
 * {
 *   "status": {
 *     "errors": [
 *       "The name must have a minimum of 3 characters and a maximum of 56 characters",
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
  '/budgets',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'A valid circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { circleId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sExpensesService = new ExpensesService();

    // get all budgets
    sExpensesService
      .getBudgets(authUser.id, circleId)
      .then((result) => {
        if (result === null) {
          throw new BvitError(400, 'There was a problem fetching budgets.');
        }
        return res.json(new Transport(200, null, { budgets: result }));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {post}  /plugin/expenses/removeBudget Removes budget
 * @apiDescription Removes a budget based on the budget id
 * @apiName /plugin/expenses/removeBudget
 * @apiGroup Expenses
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParamExample {json} Request-Example:
 * {
 *   circleId: 1,
 *   budgetId: 1,
 * }
 *
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   }
 * }
 *
 * @apiError {401} UNAUTHORIZED Authentication is required and has failed or has not yet been provided.
 * @apiError {404} NOT_FOUND The requested resource could not be found but may be available in the future.
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
 * HTTP/1.1 422 Unprocessable Entity
 * {
 *   "status": {
 *     "errors": [
 *       "The name must have a minimum of 3 characters and a maximum of 56 characters",
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
  '/removebudget',
  passport.authenticate('jwt', { session: false }),
  [
    check('budgetId', 'A valid Budget Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check('circleId', 'A valid circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { budgetId, circleId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sExpensesService = new ExpensesService();

    // delete a budget
    sExpensesService
      .removeBudget(authUser.id, budgetId, circleId)
      .then((resultId) => {
        if (resultId <= 0) {
          throw new BvitError(400, 'There was a problem deleting the budget');
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
