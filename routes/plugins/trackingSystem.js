// Express - Router
const router = require('express').Router();

// Password + JWT
const passport = require('passport');

// Express - Validation (https://www.npmjs.com/package/express-validator)
const { check } = require('express-validator');

// JWT Strategy
const jwtStrategy = require('../../core/jwtStrategy');

passport.use(jwtStrategy);

// Check if Express-Validtor returned an error
const {
  mdwHasErrors,
  formatReturnError,
  ErrorReturnType,
} = require('../../core/express/errors');

// utility
const {
  checkIfIsValidLatitude,
  checkIfIsValidLongitude,
  checkIfUserBelongsCircle,
} = require('../../core/express/validations');

// Business Logic Layers
const TrackingSystemService = require('../../services/plugins/trackingSystemService');

// Transportation Class
const Transport = require('../../models/transport/transport');

/**
 * @api {post} /plugin/tracking/setPosition Set Position
 * @apiDescription Set the user Position
 * @apiName /plugin/tracking/setPosition
 * @apiGroup Trancking Plugin
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {decimal} latitude Latitude - decimal(11,8)
 * @apiParam {decimal} longitude Longitude - decimal(11,8)
 * @apiParamExample {json} Request-Example:
 * {
 *  "latitude": 49.246292,
 *  "longitude": -123.116226
 * }
 *
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *  "status": {
 *    "id": 200,
 *    "errors": null
 *  }
 * }
 */
router.post(
  '/setPosition',
  passport.authenticate('jwt', { session: false }),
  [
    check('latitude', 'Latitude is required')
      .not()
      .isEmpty()
      .isDecimal()
      .custom((value) => checkIfIsValidLatitude(value)),
    check('longitude', 'Longitude is required')
      .not()
      .isEmpty()
      .isDecimal()
      .custom((value) => checkIfIsValidLongitude(value)),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { latitude, longitude } = req.body;

    // Service Layer
    const sTrackingSystem = new TrackingSystemService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sTrackingSystem
      .setUserPosition(authUser.id, latitude, longitude)
      .then(() => {
        const transport = new Transport(200, null, null);
        delete transport.data;
        return res.json(transport);
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {get} /plugin/tracking/getPositions Get Positions
 * @apiDescription Get the position of all users in a circle
 * @apiName /plugin/tracking/getPositions
 * @apiGroup Trancking Plugin
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
 *
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 *{
 *  "status": {
 *    "id": 200,
 *    "errors": null
 *  },
 *  "data": [
 *    {
 *     "userId": 1,
 *     "userExtId": "HSUAHDUAHU46797",
 *     "email": "email@email.com",
 *     "userFirstName": "First Name",
 *     "userLastName": "Last Name",
 *     "photoUrl": null,
 *     "latitude": 49.246292,
 *     "longitude": -123.116226,
 *     "lastUpdatedOn": "2020-06-16T05:48:04.000Z"
 *    },
 *    {
 *     "userId": 2,
 *     "userExtId": "HSUAHDUAHU46797",
 *     "email": "email2@email.com",
 *     "userFirstName": "First Name 2",
 *     "userLastName": "Last Name 2",
 *     "photoUrl": null,
 *     "latitude": 49.246291,
 *     "longitude": -123.116226,
 *     "lastUpdatedOn": "2020-06-16T05:48:04.000Z"
 *    }
 *  ]
 *}
 */
router.get(
  '/getPositions',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { circleId } = req.query;

    // Service Layer
    const sTrackingSystem = new TrackingSystemService();

    // Deleting an existing to-do
    sTrackingSystem
      .getUsersPosition(circleId)
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
