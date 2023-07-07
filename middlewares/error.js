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
  console.log('message', err.message);
  // если код ошибки 500, вернуть ошибку InternalServerError, если нет, вернуть сообщение об ошибке

  if (message === 'jwt must be provided') {
    error = new JsonWebTokenError(err.message);
  } else if (statusCode === 500) {
    error = new InternalServerError(err.message);
  }
  // error = new Error(err.message);

  res.send(error);
  next();

  // if (err.statusCode === 500) {
  //   return new InternalServerError(err);
  // } if (err.message === 'jwt must be provided') {
  //   return new JsonWebTokenError(err);
  // } return new Error(err.message);
  // next();
};

module.exports = errorHandler;
