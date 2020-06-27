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

// utility
const { checkIfUserBelongsCircle } = require('../core/express/validations');

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

/**
 * @api {get} /plugin/getPluginOnACircle Active plugins on a Circle
 * @apiDescription Get all active plugins on a Circle
 * @apiName /plugin/getPluginOnACircle
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
 * @apiParam {int} circleId Circle id
 *
 * @apiSuccess {array} List of plugin ID's
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   }
 * }
 */
router.get(
  '/getPluginOnACircle',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { circleId } = req.query;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sPlugin = new PluginService();

    // Add the Plugin to the Circle
    sPlugin
      .getAllPluginsOnCircle(circleId, authUser.id)
      .then((plugins) => {
        if (!plugins) {
          throw new BvitError(
            404,
            'There are no active plugins on the circle.'
          );
        } else {
          return res.json(
            new Transport(
              200,
              null,
              plugins.map((p) => {
                return p.id;
              })
            )
          );
        }
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {post} /plugin/addPluginFromCircle Add a Plugin to a Circle
 * @apiDescription Add a Plugin to a Circle
 * @apiName /plugin/addPluginFromCircle
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
 * @apiParam {int} id Plugin Id
 * @apiParam {int} circleId Circle id
 * @apiParamExample {json} Request-Example:
 * {
 *  "id": 1,
 *  "circleId": 1
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
 */
router.post(
  '/addPluginFromCircle',
  passport.authenticate('jwt', { session: false }),
  [
    check('id', 'Plugin Id is required').not().isEmpty().isNumeric().toInt(),
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id, circleId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sPlugin = new PluginService();

    // Add the Plugin to the Circle
    sPlugin
      .addPluginToCircle(id, circleId, authUser.id)
      .then((resultId) => {
        if (resultId <= 0) {
          throw new BvitError(400, 'Plugin not added to the circle.');
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
 * @api {delete} /plugin/deletePluginFromCircle Remove a Plugin From a Circle
 * @apiDescription Remove a Plugin From a Circle
 * @apiName /plugin/deletePluginFromCircle
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
 * @apiParam {int} id Plugin Id
 * @apiParam {int} circleId Circle id
 * @apiParamExample {json} Request-Example:
 * {
 *  "id": 1,
 *  "circleId": 1
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
 */
router.delete(
  '/deletePluginFromCircle',
  passport.authenticate('jwt', { session: false }),
  [
    check('id', 'Plugin Id is required').not().isEmpty().isNumeric().toInt(),
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id, circleId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sPlugin = new PluginService();

    // Add the Plugin to the Circle
    sPlugin
      .deletePluginToCircle(id, circleId, authUser.id)
      .then((resultId) => {
        if (resultId <= 0) {
          throw new BvitError(400, 'Plugin not removed from circle.');
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
