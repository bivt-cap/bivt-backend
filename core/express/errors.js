// Express - Validation (https://www.npmjs.com/package/express-validator)
const { validationResult } = require('express-validator');

// Transportation Class
const Transport = require('../../models/transport/transport');

// BVIT error class
const BvitError = require('./bvitError');

// "Enum": since are not supported in JavaScript natively,
// I will create a const and freeze the object so nothing
// can be add to the object
const ErrorReturnType = {
  JSON: 1,
  HTML: 2,
};
Object.freeze(ErrorReturnType);

/*
 * Format and return an error in a fancy way
 */
const formatReturnError = (res, error, returnType) => {
  // Transport object to return an error
  let transportError;

  // Check the type of the erro
  if (error instanceof BvitError) {
    transportError = new Transport(error.code, error.message, null);
  } else if (Array.isArray(error)) {
    // Error returned from Express-validator

    // Check if has a message "Unauthorized"
    if (error.includes('Unauthorized')) {
      transportError = new Transport(401, 'Unauthorized', null);
    } else {
      transportError = new Transport(
        422,
        [
          ...new Set(
            error.map((e) => {
              return e;
            })
          ),
        ],
        null
      );
    }
  } else if (error.message !== undefined) {
    transportError = new Transport(500, error.message, null);
  } else {
    transportError = new Transport(500, 'Internal Server Error', null);
  }

  // Remove the property data
  delete transportError.data;

  // return the error according to its type
  if (returnType === ErrorReturnType.JSON) {
    // Return the error
    return res.status(transportError.status.id).json(transportError);
  } else {
    let htmlFeedback;
    // If is a list of errors
    if (Array.isArray(transportError.status.errors)) {
      htmlFeedback = `<ul>${transportError.status.errors
        .map((e) => {
          return `<li>${e}</li>`;
        })
        .join('')}</ul>`;
    } else {
      htmlFeedback = `<ul><li>${transportError.status.errors}</li></ul>`;
    }

    // Return the error
    return res.render(transportError.status.id.toString(), {
      feedbackError: htmlFeedback,
    });
  }
};

/*
 * Express-Validatior Middleware responsable to
 * Return an error when is present in the validationResult
 * function
 */
const mdwHasErrors = () => {
  return (req, res, next) => {
    const errors = validationResult(req);

    // Check if has error
    if (!errors.isEmpty()) {
      return formatReturnError(
        res,
        errors.array().map((e) => {
          return e.msg;
        }),
        ErrorReturnType.JSON
      );
    }

    // Continue to next Express middleware
    next();
  };
};

module.exports = {
  mdwHasErrors,
  formatReturnError,
  ErrorReturnType,
};
