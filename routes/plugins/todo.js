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
const { checkIfUserBelongsCircle } = require('../../core/express/validations');

// Business Logic Layers
const TodoService = require('../../services/plugins/todoService');

// Transportation Class
const Transport = require('../../models/transport/transport');

/**
 * @api {post} /plugin/todo/add Add a new To-do
 * @apiDescription Create a new To-do item
 * @apiName /plugin/todo/add
 * @apiGroup To-do List
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
 * @apiParam {string} description Description of the to-do
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1,
 *  "description": "Call mama"
 * }
 *
 * @apiSuccess {int} Id of the New Todo
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
  '/add',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check(
      'description',
      'The description must have a minimum of 3 characters and a maximum of 254 characters'
    ).isLength({ min: 3, max: 254 }),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { circleId, description } = req.body;

    // Service Layer
    const sTodo = new TodoService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sTodo
      .add(circleId, authUser.id, description)
      .then((result) => {
        return res.json(new Transport(200, null, { id: result }));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {put} /plugin/todo/markAsDone Mark as Done
 * @apiDescription Mark an existing to-do as done
 * @apiName /plugin/todo/markAsDone
 * @apiGroup To-do List
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {int} id To-do id
 * @apiParamExample {json} Request-Example:
 * {
 *  "id": 1
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
router.put(
  '/markAsDone',
  passport.authenticate('jwt', { session: false }),
  [check('id', 'To-do Id is required').not().isEmpty().isNumeric().toInt()],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id } = req.body;

    // Service Layer
    const sTodo = new TodoService();

    //  Authenticated user
    const authUser = req.user;

    // Mark the todo as Done
    sTodo
      .markAsDone(id, authUser.id)
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
 * @api {delete} /plugin/todo/remove Delete
 * @apiDescription Delete an existing to-do
 * @apiName /plugin/todo/remove
 * @apiGroup To-do List
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {int} id To-do id
 * @apiParamExample {json} Request-Example:
 * {
 *  "id": 1
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
router.delete(
  '/remove',
  passport.authenticate('jwt', { session: false }),
  [check('id', 'To-do Id is required').not().isEmpty().isNumeric().toInt()],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id } = req.body;

    // Service Layer
    const sTodo = new TodoService();

    //  Authenticated user
    const authUser = req.user;

    // Deleting an existing to-do
    sTodo
      .remove(id, authUser.id)
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
 * @api {put} /plugin/todo/update Update
 * @apiDescription Update an existing to-do
 * @apiName /plugin/todo/update
 * @apiGroup To-do List
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {int} id To-do id
 * @apiParam {string} description Description of the to-do
 * @apiParamExample {json} Request-Example:
 * {
 *  "id": 1,
 *  "description": "Play soccer with my son"
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
router.put(
  '/update',
  passport.authenticate('jwt', { session: false }),
  [check('id', 'To-do Id is required').not().isEmpty().isNumeric().toInt()],
  check(
    'description',
    'The description must have a minimum of 3 characters and a maximum of 254 characters'
  ).isLength({ min: 3, max: 254 }),
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id, description } = req.body;

    // Service Layer
    const sTodo = new TodoService();

    //  Authenticated user
    const authUser = req.user;

    // Deleting an existing to-do
    sTodo
      .update(id, authUser.id, description)
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
 * @api {get} /plugin/todo/list Get all to-dos
 * @apiDescription Get a list of actives to-dos
 * @apiName /plugin/todo/list
 * @apiGroup To-do List
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
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1
 * }
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
 *      "id": 1,
 *      "description": "Call mama",
 *      "done": 0,
 *      "removed": 0
 *    },
 *    {
 *      "id": 2,
 *      "description": "Discovery the coca-cola secret recipe",
 *      "done": 0,
 *      "removed": 1
 *    },
 *    {
 *      "id": 3,
 *      "description": "Find the cure for COVID 19",
 *      "done": 1,
 *      "removed": 0
 *    }
 *  ]
 *}
 */
router.get(
  '/list',
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
    const { circleId } = req.body;

    // Service Layer
    const sTodo = new TodoService();

    //  Authenticated user
    const authUser = req.user;

    // Deleting an existing to-do
    sTodo
      .getAll(circleId, authUser.id)
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
