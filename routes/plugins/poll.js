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
  checkIfIsValidDatetime,
  checkIfUserBelongsCircle,
} = require('../../core/express/validations');

// Business Logic Layers
const PollService = require('../../services/plugins/pollService');

// Transportation Class
const Transport = require('../../models/transport/transport');

/**
 * @api {post} /plugin/poll/add Add Poll
 * @apiDescription Add a new Poll
 * @apiName /plugin/poll/add
 * @apiGroup Poll
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
 * @apiParam {string} question Question
 * @apiParam {string} startOn Start datetime (yyyy-MM-dd HH:MM:SS)
 * @apiParam {string} endOn End datetime (yyyy-MM-dd HH:MM:SS)
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1,
 *  "question": "Who took the cookie from the cookie jar?",
 *  "startOn": "2020-06-12 00:00:00",
 *  "endOn": "2020-06-19 23:59:59"
 * }
 *
 * @apiSuccess {int} Id of the New Poll
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
      'question',
      'The Question must have a minimum of 3 characters and a maximum of 1024 characters'
    ).isLength({ min: 3, max: 1024 }),
    check(
      'startOn',
      'Start on is not a valid datetime format (yyyy-MM-dd HH:MM:SS)'
    )
      .not()
      .isEmpty()
      .custom((value) => {
        return checkIfIsValidDatetime(value);
      }),
    check(
      'endOn',
      'End on is not a valid datetime format (yyyy-MM-dd HH:MM:SS)'
    )
      .not()
      .isEmpty()
      .custom((value) => {
        return checkIfIsValidDatetime(value);
      }),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { circleId, question, startOn, endOn } = req.body;

    // Service Layer
    const sPoll = new PollService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sPoll
      .addPoll(circleId, authUser.id, question, startOn, endOn)
      .then((result) => {
        return res.json(new Transport(200, null, { id: result }));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {put} /plugin/poll/edit Edit Poll
 * @apiDescription Edit an existing question
 * @apiName /plugin/poll/edit
 * @apiGroup Poll
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {int} id Poll Id
 * @apiParam {int} circleId Circle Id
 * @apiParam {string} question Question
 * @apiParam {string} startOn Start datetime (yyyy-MM-dd HH:MM:SS)
 * @apiParam {string} endOn End datetime (yyyy-MM-dd HH:MM:SS)
 * @apiParamExample {json} Request-Example:
 * {
 *  "id": 1,
 *  "circleId": 1,
 *  "question": "Who took the cookie from the cookie jar?",
 *  "startOn": "2020-06-12 00:00:00",
 *  "endOn": "2020-06-19 23:59:59"
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
  '/edit',
  passport.authenticate('jwt', { session: false }),
  [
    check('id', ' Id is required').not().isEmpty().isNumeric().toInt(),
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check(
      'question',
      'The Question must have a minimum of 3 characters and a maximum of 1024 characters'
    ).isLength({ min: 3, max: 1024 }),
    check(
      'startOn',
      'Start on is not a valid datetime format (yyyy-MM-dd HH:MM:SS)'
    )
      .not()
      .isEmpty()
      .custom((value) => {
        return checkIfIsValidDatetime(value);
      }),
    check(
      'endOn',
      'End on is not a valid datetime format (yyyy-MM-dd HH:MM:SS)'
    )
      .not()
      .isEmpty()
      .custom((value) => {
        return checkIfIsValidDatetime(value);
      }),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id, circleId, question, startOn, endOn } = req.body;

    // Service Layer
    const sPoll = new PollService();

    // Create a new Todo
    sPoll
      .editPoll(id, circleId, question, startOn, endOn)
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
 * @api {delete} /plugin/poll/remove Remove Poll
 * @apiDescription Remove an existing question
 * @apiName /plugin/poll/remove
 * @apiGroup Poll
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {int} id Poll Id
 * @apiParam {int} circleId Circle Id
 * @apiParamExample {json} Request-Example:
 * {
 *  "id": 1,
 *  "circleId": 1,
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
  [
    check('id', ' Id is required').not().isEmpty().isNumeric().toInt(),
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

    // Service Layer
    const sPoll = new PollService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sPoll
      .removePoll(id, circleId, authUser.id)
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
 * @api {get} /plugin/poll/getActives Active Polls
 * @apiDescription Get all active polls
 * @apiName /plugin/poll/getActives
 * @apiGroup Poll
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
 *  "circleId": 1,
 * }
 *
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
 *       "question": "Who took the cookie from the cookie jar?",
 *       "createdOn": "2020-06-13T04:42:13.000Z",
 *       "createdBy": "First Name Last Name",
 *       "periodStartOn": "2020-06-12T07:00:00.000Z",
 *       "periodEndOn": "2020-06-27T06:59:59.000Z"
 *     }
 *   ]
 * }
 */
router.get(
  '/getActives',
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

    // Service Layer
    const sPoll = new PollService();

    // Create a new Todo
    sPoll
      .getActivePolls(circleId)
      .then((result) => {
        return res.json(new Transport(200, null, result));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {get} /plugin/poll/getValidPolls Valid Polls
 * @apiDescription Get all valid polls in the last month
 * @apiName /plugin/poll/getValidPolls
 * @apiGroup Poll
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
 *  "circleId": 1,
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
router.get(
  '/getValidPolls',
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

    // Service Layer
    const sPoll = new PollService();

    // Get list os polls
    sPoll
      .getAllValidPolls(circleId)
      .then((result) => {
        return res.json(new Transport(200, null, result));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {post} /plugin/poll/addAnswer Add Answer
 * @apiDescription Add a new answer to an existing Poll
 * @apiName /plugin/poll/addAnswer
 * @apiGroup Poll
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
 * @apiParam {int} pollId Poll Id
 * @apiParam {string} answer Answer
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1,
 *  'pollId": 1,
 *  "answer": "Panda"
 * }
 *
 * @apiSuccess {int} Id of the New Poll
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
  '/addAnswer',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('pollId', 'Poll Id is required').not().isEmpty().isNumeric().toInt(),
    check(
      'answer',
      'The Answer must have a minimum of 3 characters and a maximum of 1024 characters'
    ).isLength({ min: 3, max: 1024 }),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { pollId, answer } = req.body;

    // Service Layer
    const sPoll = new PollService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sPoll
      .addAnswer(pollId, authUser.id, answer)
      .then((result) => {
        return res.json(new Transport(200, null, { id: result }));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {put} /plugin/poll/editAnswer Edit Answer
 * @apiDescription Edit an existing Answer
 * @apiName /plugin/poll/editAnswer
 * @apiGroup Poll
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
 * @apiParam {int} pollId Poll Id
 * @apiParam {int} id Answer Id
 * @apiParam {string} answer Answer
 * @apiParamExample {json} Request-Example:
 * {
 *  "id": 1,
 *  "circleId": 1,
 *  "question": "Who took the cookie from the cookie jar?",
 *  "startOn": "2020-06-12 00:00:00",
 *  "endOn": "2020-06-19 23:59:59"
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
  '/editAnswer',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('pollId', 'Poll Id is required').not().isEmpty().isNumeric().toInt(),
    check('id', 'Id is required').not().isEmpty().isNumeric().toInt(),
    check(
      'answer',
      'The Answer must have a minimum of 3 characters and a maximum of 1024 characters'
    ).isLength({ min: 3, max: 1024 }),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { pollId, id, answer } = req.body;

    // Service Layer
    const sPoll = new PollService();

    // Create a new Todo
    sPoll
      .editAnswer(id, pollId, answer)
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
 * @api {delete} /plugin/poll/removeAnswer Remove Answer
 * @apiDescription Remove an existing Answer
 * @apiName /plugin/poll/removeAnswer
 * @apiGroup Poll
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
 * @apiParam {int} pollId Poll Id
 * @apiParam {int} id Answer Id
 * @apiParam {string} answer Answer
 * @apiParamExample {json} Request-Example:
 * {
 *  "id": 1,
 *  "circleId": 1,
 *  "question": "Who took the cookie from the cookie jar?",
 *  "startOn": "2020-06-12 00:00:00",
 *  "endOn": "2020-06-19 23:59:59"
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
  '/removeAnswer',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('pollId', 'Poll Id is required').not().isEmpty().isNumeric().toInt(),
    check('id', 'Id is required').not().isEmpty().isNumeric().toInt(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { pollId, id } = req.body;

    // Service Layer
    const sPoll = new PollService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sPoll
      .removeAnswer(id, pollId, authUser.id)
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
 * @api {get} /plugin/poll/getActiveAnswers Active Answers
 * @apiDescription Get all active answers
 * @apiName /plugin/poll/getActiveAnswers
 * @apiGroup Poll
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
 * @apiParam {int} id Poll Id
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1,
 *  "id": 1,
 * }
 *
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
 *       "answer": "Panda",
 *       "totalVotes": 0
 *     },
 *     {
 *       "id": 2,
 *       "answer": "Rabbit",
 *       "totalVotes": 0
 *     },
 *     {
 *       "id": 3,
 *       "answer": "Bear",
 *       "totalVotes": 0
 *     },
 *     {
 *       "id": 4,
 *       "answer": "Penguin",
 *       "totalVotes": 0
 *     },
 *     {
 *       "id": 5,
 *       "answer": "Kangaroo",
 *       "totalVotes": 0
 *     }
 *   ]
 * }
 */
router.get(
  '/getActiveAnswers',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('pollId', 'Poll Id is required').not().isEmpty().isNumeric().toInt(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { pollId } = req.body;

    // Service Layer
    const sPoll = new PollService();

    // Create a new Todo
    sPoll
      .getActiveAnswers(pollId)
      .then((result) => {
        return res.json(new Transport(200, null, result));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {post} /plugin/poll/addVote Add Vote
 * @apiDescription Add a new vote to an Answer
 * @apiName /plugin/poll/addVote
 * @apiGroup Poll
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
 * @apiParam {int} pollId Poll Id
 * @apiParam {int} answerId Answer Id
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1,
 *  'pollId": 1,
 *  "answerId": 1
 * }
 *
 * @apiSuccess {int} Id of the New Poll
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
  '/addVote',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('pollId', 'Poll Id is required').not().isEmpty().isNumeric().toInt(),
    check('answerId', 'Answer Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { answerId } = req.body;

    // Service Layer
    const sPoll = new PollService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sPoll
      .addVote(answerId, authUser.id)
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
 * @api {get} /plugin/poll/getVotes Get Voltes
 * @apiDescription Get all votes in a Poll
 * @apiName /plugin/poll/getVotes
 * @apiGroup Poll
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
 * @apiParam {int} id Poll Id
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1,
 *  "id": 1,
 * }
 *
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   },
 *   "data": [
 *     {
 *       "answerId": 1,
 *       "createdOn": "2020-06-13T05:26:09.000Z",
 *       "createdBy": "First Name Last Name"
 *     }
 *   ]
 * }
 */
router.get(
  '/getVotes',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('pollId', 'Poll Id is required').not().isEmpty().isNumeric().toInt(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { pollId } = req.body;

    // Service Layer
    const sPoll = new PollService();

    // Create a new Todo
    sPoll
      .getVotes(pollId)
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
