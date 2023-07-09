/* eslint-disable no-console */

// const http2 = require('http2').constants;

// const ValidationError = require('../errors/ValidationError');
const InternalServerError = require('../errors/InternalServerError');
const JsonWebTokenError = require('../errors/JsonWebTokenError');
// const NotFound = require('../errors/NotFound');
// const JsonWebToken = require('../errors/JsonWebTokenError');

const errorHandler = (err, req, res, next) => {
  let error;

  if (err.message === 'jwt must be provided') {
    error = new JsonWebTokenError();
  } else if (err.statusCode === 500) {
    error = new InternalServerError();
  } else {
    error = new Error(err);
  }

  res.send(error);
  next();

  // return next();

  // res.status(status).send({
  //   message: status === 500 ? 'InternalServerError' : message,
  // });

  // return next();
};

//   let error;
//   const { statusCode, message } = err;
//   // console.log(new JsonWebTokenError(err.message));

//   if (message === 'jwt must be provided') {
//     error = new JsonWebTokenError(err.message);
//   } else if (statusCode === 500) {
//     error = new InternalServerError(err.message);
//   }

//   res.send(error);
//   // console.log('error-', error, 'res-', res.status);
//   next();
// };

module.exports = errorHandler;
