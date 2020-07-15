// Node.JS module
const path = require('path');
const fs = require('fs');

// Express - Router
const router = require('express').Router();

// Password + JWT
const passport = require('passport');

// Express - Validation (https://www.npmjs.com/package/express-validator)
const { check } = require('express-validator');

// Multer
const multer = require('multer');

// UUID
const { v4: uuidv4 } = require('uuid');

// utility
const {
  checkIfIsValidDatetime,
  checkIfUserBelongsCircle,
} = require('../../core/express/validations');

// JWT Strategy
const jwtStrategy = require('../../core/jwtStrategy');

passport.use(jwtStrategy);

// Check if Express-Validtor returned an error
const {
  mdwHasErrors,
  formatReturnError,
  ErrorReturnType,
} = require('../../core/express/errors');

// Business Logic Layers
const EventService = require('../../services/plugins/eventService');

// Transportation Class
const Transport = require('../../models/transport/transport');

// Storage - Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const currentDateTime = new Date();
    const filePath = path.join(
      __dirname,
      '../../public/images/plugin/event',
      currentDateTime.toISOString().slice(0, 10)
    );

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}.jpg`);
  },
});

const multerUpload = multer({
  storage: multerStorage,
  limits: { fileSize: 2 * 1024 ** 2 }, // 2 MB
  fileFilter(req, file, cb) {
    // Only allows JPG
    cb(null, file.mimetype === 'image/jpeg');
  },
}).single('photo');

/**
 * @api {post} /plugin/event/add Add
 * @apiDescription Add a new Event
 * @apiName /plugin/event/add
 * @apiGroup Event
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
 * @apiParam {string} title Event Title
 * @apiParam {string} startOn Start datetime (yyyy-MM-dd HH:MM:SS)
 * @apiParam {string} endOn End datetime (yyyy-MM-dd HH:MM:SS)
 * @apiParam {string} note Notes about the event
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1,
 *  "title": "End of the world party",
 *  "startOn": "2020-06-12 00:00:00",
 *  "endOn": "2020-06-19 23:59:59",
 *  "note": "Bring your own drink"
 * }
 *
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
      'title',
      'The Title must have a minimum of 3 characters and a maximum of 254 characters'
    ).isLength({ min: 3, max: 254 }),
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
    const { circleId, title, startOn, endOn, note } = req.body;

    // Service Layer
    const sEventService = new EventService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sEventService
      .add(circleId, title, startOn, endOn, note, authUser.id)
      .then((id) => {
        return res.json(new Transport(200, null, { id }));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {put} /plugin/event/update Update
 * @apiDescription Update an existent event
 * @apiName /plugin/event/update
 * @apiGroup Event
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
 * @apiParam {int} id Event Id
 * @apiParam {string} title Event Title
 * @apiParam {string} startOn Start datetime (yyyy-MM-dd HH:MM:SS)
 * @apiParam {string} endOn End datetime (yyyy-MM-dd HH:MM:SS)
 * @apiParam {string} note Notes about the event
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1,
 *  "id": 1,
 *  "title": "End of the world party",
 *  "startOn": "2020-06-12 00:00:00",
 *  "endOn": "2020-06-19 23:59:59",
 *  "note": "Bring your own drink"
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
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('id', 'Event Id is required').not().isEmpty().isNumeric().toInt(),
    check(
      'title',
      'The Title must have a minimum of 3 characters and a maximum of 254 characters'
    ).isLength({ min: 3, max: 254 }),
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
    const { id, title, startOn, endOn, note } = req.body;

    // Service Layer
    const sEventService = new EventService();

    // Create a new Todo
    sEventService
      .update(id, title, startOn, endOn, note)
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
 * @api {delete} /plugin/event/remove Remove
 * @apiDescription Remove an existent event
 * @apiName /plugin/event/remove
 * @apiGroup Event
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
 * @apiParam {int} id Event Id
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1,
 *  "id": 1,
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
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('id', 'Event Id is required').not().isEmpty().isNumeric().toInt(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sEventService = new EventService();

    // Create a new Todo
    sEventService
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
 * @api {get} /plugin/event/list Get by period
 * @apiDescription Get events between start and enddate
 * @apiName /plugin/event/list
 * @apiGroup Event
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
 * @apiParam {string} startOn Start Date (YYYY-MM-DD HH:MM:SS)
 * @apiParam {string} endOn End Date (YYYY-MM-DD HH:MM:SS)
 *
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *  "status": {
 *    "id": 200,
 *    "errors": null
 *  },
 *   "data": [
 *     {
 *       "id": 1,
 *       "title": "End of the world party",
 *       "startOn": "2020-06-12 00:00:00",
 *       "endOn": "2020-06-19 23:59:59",
 *       "note": "Bring your own drink"
 *     },
 *     {
 *       "id": 2,
 *       "title": "End of the world after party",
 *       "startOn": "2020-06-12 00:00:00",
 *       "endOn": "2020-06-19 23:59:59",
 *       "note": "Don't forget you hangover medicine"
 *     }
 *   ]
 * }
 */
router.get(
  '/list',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
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
    const { circleId, startOn, endOn } = req.query;

    // Service Layer
    const sEventService = new EventService();

    // Create a new Todo
    sEventService
      .getEvents(circleId, startOn, endOn)
      .then((result) => {
        return res.json(new Transport(200, null, result));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {post} /plugin/event/addMember Add Member
 * @apiDescription  Add a Member to an Event
 * @apiName /plugin/event/addMember
 * @apiGroup Event
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
 * @apiParam {int} id Event Id
 * @apiParam {int} userId User id to add as a member
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1,
 *  "id": 1,
 *  "userId": 1
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
  '/addMember',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('id', 'Event Id is required').not().isEmpty().isNumeric().toInt(),
    check('userId', 'User Id is required').not().isEmpty().isNumeric().toInt(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id, userId } = req.body;

    // Service Layer
    const sEventService = new EventService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sEventService
      .addMember(id, userId, authUser.id)
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
 * @api {get} /plugin/event/listMembers?circleId=1&id=2 Get Members
 * @apiDescription Get all member in an event
 * @apiName /plugin/event/listMembers
 * @apiGroup Event
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
 * @apiParam {int} id Event Id
 *
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *  "status": {
 *    "id": 200,
 *    "errors": null
 *  },
 *   "data": [
 *     {
 *       "id": 1,
 *       "name": "Member One",
 *       "photoUrl": null
 *     },
 *     {
 *       "id": 2,
 *       "name": "Member Two",
 *       "photoUrl": "https://...."
 *     }
 *   ]
 * }
 */
router.get(
  '/listMembers',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('id', 'Event Id is required').not().isEmpty().isNumeric().toInt(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id } = req.query;

    // Service Layer
    const sEventService = new EventService();

    // Create a new Todo
    sEventService
      .getMembers(id)
      .then((result) => {
        return res.json(new Transport(200, null, result));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {delete} /plugin/event/removeMember Remove Member
 * @apiDescription Remove a Member from an Event
 * @apiName /plugin/event/removeMember
 * @apiGroup Event
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
 * @apiParam {int} id Event Id
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1,
 *  "id": 1,
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
  '/removeMember',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('id', 'Event Id is required').not().isEmpty().isNumeric().toInt(),
    check('userId', 'User Id is required').not().isEmpty().isNumeric().toInt(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id, userId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sEventService = new EventService();

    // Create a new Todo
    sEventService
      .removeMember(id, userId, authUser.id)
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
 * @api {post} /plugin/event/addPhoto?circleId=??&id=?? Add Photo
 * @apiDescription Add a new Photo to an Event
 * @apiName /plugin/event/addPhoto
 * @apiGroup Event
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type multipart/form-data
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: multipart/form-data
 *
 * @apiParam {int} id Shoppint list Item Id
 * @apiParam {int} circleId Circle Id
 * @apiParam {file} photo Photo (File)
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
  '/addPhoto',
  passport.authenticate('jwt', { session: false }),
  [
    check('Content-Type', 'Content-Type not allowed')
      .not()
      .isEmpty()
      .if((value) => value.indexOf('multipart/form-data') !== 0),
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('id', 'Event Id is required').not().isEmpty().isNumeric().toInt(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id } = req.params;

    multerUpload(req, res, (errorMulter) => {
      // Check if has a error
      if (errorMulter) {
        return formatReturnError(
          res,
          new Error('Internal Server Error'),
          ErrorReturnType.JSON
        );
      } else {
        // Path for the image
        const imagePath = req.file.path
          .replace(path.join(__dirname, '../../'), '')
          .replace(/\\/g, '/');

        //  Authenticated user
        const authUser = req.user;

        // Service Layer
        const sEventService = new EventService();

        // Create a new Todo
        sEventService
          .addPhoto(id, imagePath, authUser.id)
          .then(() => {
            const transport = new Transport(200, null, null);
            delete transport.data;
            return res.json(transport);
          })
          .catch((error) => {
            return formatReturnError(res, error, ErrorReturnType.JSON);
          });
      }
    });
  }
);

/**
 * @api {get} /plugin/event/listPhotos?circleId=1&id=2 Get Photos
 * @apiDescription Get all photos in an event
 * @apiName /plugin/event/listPhotos
 * @apiGroup Event
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
 * @apiParam {int} id Event Id
 *
 * @apiSuccessExample {json} Example
 * HTTP/1.1 200 OK
 * {
 *  "status": {
 *    "id": 200,
 *    "errors": null
 *  },
 *   "data": [
 *     {
 *       "id": 1,
 *       "name": "Member One",
 *       "photoUrl": null
 *     },
 *     {
 *       "id": 2,
 *       "name": "Member Two",
 *       "photoUrl": "https://...."
 *     }
 *   ]
 * }
 */
router.get(
  '/listPhotos',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('id', 'Event Id is required').not().isEmpty().isNumeric().toInt(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id } = req.params;

    // Service Layer
    const sEventService = new EventService();

    // Create a new Todo
    sEventService
      .getPhotos(id)
      .then((list) => {
        const formatedList = list.map((item) => {
          return {
            ...item,
            photoUrl: item.photoUrl
              ? `${req.protocol}://${req.get('host')}/plugin/event/photo/${
                  item.photoId
                }`
              : null,
          };
        });
        return res.json(new Transport(200, null, formatedList));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {get} /plugin/event/photo Photo
 * @apiDescription Return a photo "file"
 * @apiName /plugin/event/photo
 * @apiGroup Event
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {string} id Photo Id
 *
 * @apiSuccessExample {file} Example
 * HTTP/1.1 200 OK
 */
router.get(
  '/photo/:id',
  passport.authenticate('jwt', { session: false }),
  [check('id', 'Id is Requeried').not().isEmpty()],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id } = req.params;

    // Service Layer
    const sEventService = new EventService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sEventService
      .getPhotoPath(id, authUser.id)
      .then((photoPath) => {
        const fileName = path.join(__dirname, '../../', photoPath);
        res.sendFile(
          fileName,
          {
            dotfiles: 'deny',
            headers: {
              'x-timestamp': Date.now(),
              'x-sent': true,
            },
          },
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {delete} /plugin/event/removePhoto Remove Photo
 * @apiDescription Remove a Photo from an Event
 * @apiName /plugin/event/removePhoto
 * @apiGroup Event
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
 * @apiParam {int} eventId Event Id
 * @apiParam {string} photoId Photo Id
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1,
 *  "eventId": 1,
 *  "photoId": "ASHui12979",
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
  '/removePhoto',
  passport.authenticate('jwt', { session: false }),
  [
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('eventId', 'Event Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check('photoId', 'PhotoId is Requeried').not().isEmpty(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { eventId, photoId } = req.body;

    //  Authenticated user
    const authUser = req.user;

    // Service Layer
    const sEventService = new EventService();

    // Create a new Todo
    sEventService
      .removePhoto(eventId, photoId, authUser.id)
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

// Export this router
module.exports = router;
