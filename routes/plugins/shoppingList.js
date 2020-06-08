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

// Business Logic Layers
const ShoppingListService = require('../../services/plugins/shoppingListService');

// Transportation Class
const Transport = require('../../models/transport/transport');

// Storage - Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const currentDateTime = new Date();
    const filePath = path.join(
      __dirname,
      '../../public/images/shoppingList/',
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
 * @api {post} /plugin/shoppingList/add Add
 * @apiDescription Create a new Shopping List item
 * @apiName /plugin/shoppingList/add
 * @apiGroup PluginShoppingList
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
 * @apiParam {string} description Description of the Shopping List Item
 * @apiParamExample {json} Request-Example:
 * {
 *  "circleId": 1,
 *  "description": Bread"
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
    const sShoppingList = new ShoppingListService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sShoppingList
      .add(authUser.id, circleId, description)
      .then((result) => {
        return res.json(new Transport(200, null, { id: result }));
      })
      .catch((error) => {
        return formatReturnError(res, error, ErrorReturnType.JSON);
      });
  }
);

/**
 * @api {put} /plugin/shoppingList/setPhotoPath?circleId=??&id=?? Set Photo
 * @apiDescription Set a photo to an existing item
 * @apiName /plugin/shoppingList/setPhotoPath?circleId
 * @apiGroup PluginShoppingList
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
 *       "To-do Id is required",
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
router.put(
  '/setPhotoPath',
  passport.authenticate('jwt', { session: false }),
  [
    check('Content-Type', 'Content-Type not allowed')
      .not()
      .isEmpty()
      .if((value) => value.indexOf('multipart/form-data') !== 0),
    check('id', 'Shoppint list Item Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
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
    const { id, circleId } = req.query;

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

        // Service Layer
        const sShoppingList = new ShoppingListService();

        // Create a new Todo
        sShoppingList
          .setPhotoPath(id, circleId, imagePath)
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
 * @api {put} /plugin/shoppingList/update Update
 * @apiDescription Update an existing item
 * @apiName /plugin/shoppingList/update
 * @apiGroup PluginShoppingList
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {int} id Shoppint list Item Id
 * @apiParam {int} circleId Circle Id
 * @apiParam {string} description Description of the Shopping List Item
 * @apiParamExample {json} Request-Example:
 * {
 *  "id": 1
 *  "circleId": 1,
 *  "description": "Cake"
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
router.put(
  '/update',
  passport.authenticate('jwt', { session: false }),
  [
    check('id', 'Shoppint list Item Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
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
    const { id, circleId, description } = req.body;

    // Service Layer
    const sShoppingList = new ShoppingListService();

    // Create a new Todo
    sShoppingList
      .update(id, circleId, description)
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
 * @api {put} /plugin/shoppingList/markAsPurchased Mark as purchased
 * @apiDescription Mark an existing item as purchased
 * @apiName /plugin/shoppingList/markAsPurchased
 * @apiGroup PluginShoppingList
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {int} id Shoppint list Item Id
 * @apiParam {int} circleId Circle Id
 * @apiParam {decimal} price Price (0 if the user doesn't want to inform the price)
 * @apiParamExample {json} Request-Example:
 * {
 *  "id": 1
 *  "circleId": 1,
 *  "price": 1.51
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
router.put(
  '/markAsPurchased',
  passport.authenticate('jwt', { session: false }),
  [
    check('id', 'Shoppint list Item Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check('circleId', 'Circle Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt()
      .custom((value, { req }) => checkIfUserBelongsCircle(value, req.user)),
    check('price', 'Price need to be a decimal value').isDecimal(),
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id, circleId, price } = req.body;

    // Service Layer
    const sShoppingList = new ShoppingListService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sShoppingList
      .markAsPurchased(id, authUser.id, circleId, price)
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
 * @api {delete} /plugin/shoppingList/remove Delete
 * @apiDescription Delete an existing item
 * @apiName /plugin/shoppingList/remove
 * @apiGroup PluginShoppingList
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} authorization bearer + 'Authorization token'
 * @apiHeader {String} content-type application/json
 *
 * @apiHeaderExample Header-Example:
 * Authorization: bearer eyJhbGc...token
 * content-type: application/json
 *
 * @apiParam {int} id Shoppint list Item Id
 * @apiParam {int} circleId Circle Id
 * @apiParamExample {json} Request-Example:
 * {
 *  "id": 1
 *  "circleId": 1
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
router.delete(
  '/remove',
  passport.authenticate('jwt', { session: false }),
  [
    check('id', 'Shoppint list Item Id is required')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
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
    const sShoppingList = new ShoppingListService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sShoppingList
      .remove(id, authUser.id, circleId)
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
 * @api {get} /plugin/shoppingList/list List
 * @apiDescription Get all active shopping list itens
 * @apiName /plugin/shoppingList/list
 * @apiGroup PluginShoppingList
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
 * {
 *   "status": {
 *     "id": 200,
 *     "errors": null
 *   },
 *   "data": [
 *     {
 *       "id": 1,
 *       "description": "Bread",
 *       "photoUrl": null,
 *       "createdOn": "2020-06-05T05:17:25.000Z",
 *       "createdBy": "User 1",
 *       "purchasedOn": null,
 *       "purchasedBy": null,
 *       "purchasedPrice": null,
 *       "removedOn": "2020-06-09T05:24:25.000Z",
 *       "removedBy": "User 2"
 *     },
 *     {
 *       "id": 2,
 *       "description": "Banana",
 *       "photoUrl": null,
 *       "createdOn": "2020-06-05T05:18:18.000Z",
 *       "createdBy": "User 2",
 *       "purchasedOn": "2020-06-09T05:18:25.000Z",
 *       "purchasedBy": "User 1",
 *       "purchasedPrice": 1.52,
 *       "removedOn": null,
 *       "removedBy": null
 *     },
 *     {
 *       "id": 3,
 *       "description": "Cake",
 *       "photoUrl": "http://fakeurl.ca/plugin/shoppingList/photo/3e6803d1-a9d9-11ea-bc5b-42010a80028b",
 *       "createdOn": "2020-06-09T03:36:01.000Z",
 *       "createdBy": "User 3",
 *       "purchasedOn": null,
 *       "purchasedBy": null,
 *       "purchasedPrice": null,
 *       "removedOn": null,
 *       "removedBy": null
 *     }
 *   ]
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
  ],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { circleId } = req.body;

    // Service Layer
    const sShoppingList = new ShoppingListService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sShoppingList
      .getAllActiveItens(circleId, authUser.id)
      .then((list) => {
        const formatedList = list.map((item) => {
          return {
            ...item,
            photoUrl: item.photoUrl
              ? `${req.protocol}://${req.get(
                  'host'
                )}/plugin/shoppingList/photo/${item.photoUrl}`
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
 * @api {get} /plugin/shoppingList/photo Photo
 * @apiDescription Return a photo "file"
 * @apiName /plugin/shoppingList/photo
 * @apiGroup PluginShoppingList
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
 * @apiSuccessExample {file} Example
 * HTTP/1.1 200 OK
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
router.get(
  '/photo/:id',
  passport.authenticate('jwt', { session: false }),
  [check('id', 'Id is Requeried').not().isEmpty()],
  mdwHasErrors(),
  (req, res) => {
    // Get the values from the body
    const { id } = req.params;

    // Service Layer
    const sShoppingList = new ShoppingListService();

    //  Authenticated user
    const authUser = req.user;

    // Create a new Todo
    sShoppingList
      .getShoppingItemByPhotoId(id, authUser.id)
      .then((item) => {
        const fileName = path.join(__dirname, '../../', item.photoPath);
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

// Export this router
module.exports = router;
