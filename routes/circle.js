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
const CircleService = require('../services/circleService');
const UserService = require('../services/userService');
const PluginService = require('../services/pluginService');

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
        if (result === null) {
          throw new BvitError(404, 'There is no circle related to this user.');
        }
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
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
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
 */
router.post(
  '/confirmUserAsMember',
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
    const { circleId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sCircle = new CircleService();

    // Try to find the invited user by email
    sCircle
      .confirmMemberOfCircle(authUser.id, circleId)
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
 */
router.post(
  '/removeUserAsMember',
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
    const { circleId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sCircle = new CircleService();

    // Try to find the invited user by email
    sCircle
      .removeMemberFromCircle(authUser.id, circleId)
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
 * @api {get} /circle/getCircleTypesAndPluginSuggestions Circle Type and Plugin
 * @apiDescription List of active Plugins and Type of groups (and each plugins suggestion for this group)
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
 * @apiSuccess {object} List of active Plugins and Type of groups (and each plugins suggestion for this group)
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   },
 *   "data": {
 *     "plugins": [
 *       {
 *         "id": 1,
 *         "name": "Calendar",
 *         "price": 0
 *       },
 *       {
 *         "id": 2,
 *         "name": "To-do List",
 *         "price": 0
 *       },
 *     ],
 *     "circleType": [
 *       {
 *         "id": 1,
 *         "name": "Family",
 *         "plugins": [
 *           1,
 *           3,
 *           4,
 *           6
 *         ]
 *       },
 *       {
 *         "id": 2,
 *         "name": "Homestay",
 *         "plugins": [
 *           1,
 *           2,
 *           3,
 *           5,
 *           6,
 *           7
 *         ]
 *       },
 *       {
 *         "id": 3,
 *         "name": "Small business",
 *         "plugins": [
 *           1,
 *           2,
 *           5,
 *           6
 *         ]
 *       }
 *     ]
 *   }
 * }
 */
router.get(
  '/getCircleTypesAndPluginSuggestions',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Service Layer
    const sCircle = new CircleService();
    const sPlugin = new PluginService();

    // Find all active plugins
    sPlugin
      .getAllActivePlugins()
      .then(async (plugins) => {
        const circleTypeAndSuggestions = await sCircle.getCircleTypesAndPluginSuggestions();
        if (circleTypeAndSuggestions === null) {
          throw new BvitError(404, 'There are no circle type.');
        } else {
          return res.json(
            new Transport(200, null, {
              plugins,
              circleType: circleTypeAndSuggestions,
            })
          );
        }
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {get} /circle/getMemberOfACircle Circle Members
 * @apiDescription Get all active (didn't leave) members in a Circle
 * @apiName /circle/getMemberOfACircle
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
 * @apiParam {int} circleId Circle of the Id
 *
 * @apiSuccess {object} List Members
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
 *       "extId": "99999999-aaaa-99aa-aa9a-99999a99999a",
 *       "email": "email@email.com",
 *       "userFirstName": "First",
 *       "userLastName": "Last",
 *       "photoUrl": null,
 *       "isOwner": 1,
 *       "joinedOn": "2000-01-17T08:00:00.000Z",
 *       "isAdmin": 1
 *     },
 *     {
 *       "id": 2,
 *       "extId": "99999999-aaaa-99aa-aa9a-99999a99999a",
 *       "email": "email@email.com",
 *       "userFirstName": "First",
 *       "userLastName": "Last",
 *       "photoUrl": "https://fake.url.ca/photo.jpg",
 *       "isOwner": 0,
 *       "joinedOn": null,
 *       "isAdmin": 0
 *     }
 *   ]
 * }
 */
router.get(
  '/getMemberOfACircle',
  passport.authenticate('jwt', { session: false }),
  check('circleId', 'Circle Id is required')
    .not()
    .isEmpty()
    .isNumeric()
    .toInt()
    .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { circleId } = req.query;

    // Service Layer
    const sCircle = new CircleService();

    // Get all active (didn't leave) members in a Circle
    sCircle
      .getMemberOfACircle(circleId)
      .then((circles) => {
        if (circles === null) {
          throw new BvitError(404, 'There are no members in this circle.');
        } else {
          return res.json(new Transport(200, null, circles));
        }
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

// Export this router
module.exports = router;
