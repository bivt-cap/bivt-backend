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

// Business Logic related to the Circle
const CircleService = require('../services/circleService');

// Business Logic related to the User
const UserService = require('../services/userService');

// Transportation Class
const Transport = require('../models/transport/transport');

/**
 * @api {post} /circle/create Create a new User Circle
 * @apiDescription Allow an authenticated user to create a new Circle providing a name
 * @apiName /circle/create
 * @apiGroup Circle
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {string} Name Name of the Circle
 * @apiParamExample {json} Request-Example:
 * {
 *  "name": "Soccer team"
 * }
 *
 * @apiSuccess {int} Id The Circle id
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *  "status": {
 *    "id": 200,
 *    "errors": null
 *  },
 *  "data": {
 *    "id": 1
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
  '/create',
  passport.authenticate('jwt', { session: false }),
  [
    check(
      'name',
      'The name must have a minimum of 3 characters and a maximum of 56 characters'
    ).isLength({ min: 3, max: 56 }),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { name } = req.body;

    // Service Layer
    const sCircle = new CircleService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Circle
    sCircle
      .getNumberCirclesByOwner(authUser.id)
      .then((result) => {
        // The user can only create 2 Circle in the free version;
        if (result < 2) {
          return result;
        } else {
          throw new BvitError(422, 'You reached the free account limit.');
        }
      })
      .then(() => sCircle.addNewCircle(authUser.id, authUser.email, name))
      .then((circleId) => {
        return res.json(new Transport(200, null, { circleId }));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {get} /circle/byUser List of Circles by User
 * @apiDescription Return the list of all Circles that the user belongs (invited or owner)
 * @apiName /circle/byUser
 * @apiGroup Circle
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiSuccess {array} circles List of Circles
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   },
 *   "data": {
 *     "circles": [
 *       {
 *         "id": 1,
 *         "name": "Circle 1",
 *         "isOwner": 1,
 *         "isAdmin": 1,
 *         "joinedAt": "2020-05-07T17:20:15.000Z"
 *       },
 *       {
 *         "id": 2,
 *         "name": "Circle 2",
 *         "isOwner": 0,
 *         "isAdmin": 1,
 *         "joinedAt": null
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
  '/byUser',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Service Layer
    const sCircle = new CircleService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Circle
    sCircle
      .getCirclesByUser(authUser.id)
      .then((result) => {
        return res.json(new Transport(200, null, { circles: result }));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {get} /circle/inviteUser Invite an email to join a Circle
 * @apiDescription Invite an email to join a Circle
 * @apiName /circle/inviteUser
 * @apiGroup Circle
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiParam {string} email Email to use to invite
 * @apiParam {int} circleId Circle id
 * @apiParamExample {json} Request-Example:
 * {
 *  "email": "email@email.com"
 *  "circleId": 1
 * }
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
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
  '/inviteUser',
  passport.authenticate('jwt', { session: false }),
  [
    check('email', 'E-mail must be a valid e-mail.').not().isEmpty().isEmail(),
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { email, circleId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sCircle = new CircleService();
    const sUser = new UserService();

    // Try to find the invited user by email
    sUser
      .getUserByEmail(email)
      .then(async (user) => {
        const userId = authUser.id;
        const userIdToInvite = user != null ? user.id : null;
        const userEmailToInvite = email;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return await sCircle.AddUserToCircle(
          userId,
          userIdToInvite,
          userEmailToInvite,
          circleId,
          baseUrl
        );
      })
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
 * @api {get} /circle/confirmUserAsMember Confirm user as a member
 * @apiDescription Confirm user as a member of a circle
 * @apiName /circle/confirmUserAsMember
 * @apiGroup Circle
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiParam {int} circleId Circle id to confirm user as a member
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1
 * }
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
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
  '/confirmUserAsMember',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { circleId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sCircle = new CircleService();

    // Try to find the invited user by email
    sCircle
      .getCirclesByUser(authUser.id)
      .then(async (circles) => {
        // Check if the user has a circle
        if (circles != null && circles.length > 0) {
          // Find in the list of Circles the circle
          const circle = circles.find((c) => {
            return c.id === circleId;
          });

          if (circle !== null) {
            return circle;
          } else {
            throw new BvitError(401, 'Unauthorized');
          }
        }
      })
      .then(async (circle) => {
        await sCircle.confirmMemberOfCircle(authUser.id, circle.id);
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
 * @api {get} /circle/removeUserAsMember Remove a user as member
 * @apiDescription Remove a user as member of a circle
 * @apiName /circle/removeUserAsMember
 * @apiGroup Circle
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiParam {int} circleId Circle id to remove user as a member
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1
 * }
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
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
  '/removeUserAsMember',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { circleId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sCircle = new CircleService();

    // Try to find the invited user by email
    sCircle
      .getCirclesByUser(authUser.id)
      .then(async (circles) => {
        // Check if the user has a circle
        if (circles != null && circles.length > 0) {
          // Find in the list of Circles the circle
          const circle = circles.find((c) => {
            return c.id === circleId && c.isAdmin === 1;
          });

          if (circle !== null) {
            return circle;
          } else {
            throw new BvitError(401, 'Unauthorized');
          }
        }
      })
      .then(async (circle) => {
        await sCircle.removeMemberFromCircle(authUser.id, circle.id);
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
 * @api {get} /circle/getCircleTypesAndPluginSuggestions Circle Type and Plugin
 * @apiDescription Get types of circle and which Plugin is a suggestion for it
 * @apiName /circle/getCircleTypesAndPluginSuggestions
 * @apiGroup Circle
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
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
router.post(
  '/getCircleTypesAndPluginSuggestions',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Service Layer
    const sCircle = new CircleService();

    // Try to find the invited user by email
    sCircle
      .getCircleTypesAndPluginSuggestions()
      .then(async (circles) => {
        const transport = new Transport(200, null, circles);
        if (circles === null) {
          delete transport.data;
        }
        return res.json(transport);
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

// Export this router
module.exports = router;
