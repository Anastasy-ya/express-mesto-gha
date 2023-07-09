/* eslint-disable no-console */

// const http2 = require('http2').constants;

// const ValidationError = require('../errors/ValidationError');
const InternalServerError = require('../errors/InternalServerError');
const JsonWebTokenError = require('../errors/JsonWebTokenError');
// const NotFound = require('../errors/NotFound');
// const JsonWebToken = require('../errors/JsonWebTokenError');

const errorHandler = (err, req, res, next) => {
  let error;
  const { statusCode, message } = err;
  // console.log('message', err.message);

  if (message === 'jwt must be provided') {
    error = new JsonWebTokenError(err.message);
  } else if (statusCode === 500) {
    error = new InternalServerError(err.message);
  }

  res.send(error);
  console.log('error-', error, 'res-', res.status);
  next();
};

module.exports = errorHandler;
