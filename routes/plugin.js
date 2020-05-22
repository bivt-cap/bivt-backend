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
const PluginService = require('../services/pluginService');

// Transportation Class
const Transport = require('../models/transport/transport');

/**
 * @api {get} /plugin/getAll All active Plguins
 * @apiDescription Get all active Plguins
 * @apiName /plugin/getAll
 * @apiGroup Plugin
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiSuccess {array} List of all active plugins
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   },
 *   "data": [
 *     {
 *       "id": 1,
 *       "name": "Calendar",
 *       "price": 0
 *     },
 *     {
 *       "id": 2,
 *       "name": "To-do List",
 *       "price": 0
 *     },
 *     {
 *       "id": 3,
 *       "name": "Shopping list",
 *       "price": 0
 *     },
 *     {
 *       "id": 4,
 *       "name": "User Tracking",
 *       "price": 6.66
 *     },
 *     {
 *       "id": 5,
 *       "name": "Poll",
 *       "price": 0
 *     },
 *     {
 *       "id": 6,
 *       "name": "Group Chat",
 *       "price": 8.25
 *     },
 *     {
 *       "id": 7,
 *       "name": "Expenses",
 *       "price": 3
 *     }
 *   ]
 * }
 *
 * @apiError {401} UNAUTHORIZED Authentication is required and has failed or has not yet been provided.
 * @apiError {404} NOT_FOUND The requested resource could not be found but may be available in the future.
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
  '/getAll',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Service Layer
    const sPlugin = new PluginService();

    // Find all active plugins
    sPlugin
      .getAllActivePlugins()
      .then((plugins) => {
        if (!plugins) {
          throw new BvitError(404, 'There are no active plugins.');
        } else {
          return res.json(new Transport(200, null, plugins));
        }
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

// Export this router
module.exports = router;
