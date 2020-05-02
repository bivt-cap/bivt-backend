// Express - Validation (https://www.npmjs.com/package/express-validator)
const { validationResult } = require('express-validator');

// Transportation Class
const Transport = require('../../models/transport/transport');

// Check if Express-Validtor returned an error
const checkErrors = () => {
  return (req, res, next) => {
    const errors = validationResult(req);

    // Check if has error
    if (!errors.isEmpty()) {
      // Is a Endpoint
      const transport = new Transport(
        422,
        errors.array().map((e) => {
          return e.msg;
        }),
        null
      );

      // Remove the property data
      delete transport.data;

      // Return the error
      return res.status(422).json(transport);
    }

    // Continue to next Express middleware
    next();
  };
};

// Format the http error 500 - JSON
const formatError500Json = (res, error) => {
  const transport = new Transport(
    500,
    error.message !== 'undefined' ? error.message : 'Internal Server Error',
    null
  );

  // Remove the property data
  delete transport.data;

  // Return the error
  return res.status(500).json(transport);
};

// Format the http error 500 - HTML
const formatError500Html = (res, error) => {
  let feedbackError;
  if (error.message === undefined && Array.isArray(error.array())) {
    feedbackError = `<ul>${error
      .array()
      .map((e) => {
        return `<li>${e.msg}</li>`;
      })
      .join('')}</ul>`;
  } else {
    feedbackError =
      error.message !== 'undefined' ? error.message : 'Internal Server Error';
  }

  return res.render('500', {
    feedbackError,
  });
};

module.exports = { checkErrors, formatError500Json, formatError500Html };
