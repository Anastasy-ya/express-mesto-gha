
const ValidationError = require('../errors/ValidationError');
const InternalServerError = require('../errors/InternalServerError');
const NotFound = require('../errors/NotFound');

// class UserNotFound extends Error {
//   constructor(err) {
//     super(err);
//     this.message = 'Пользователь не найден';
//     this.statusCode = 404;
//   }
// }

// class AbstractError extends Error {
//   constructor(err) {
//     super(err);
//     this.message = err.body;
//     this.statusCode = err.statusCode;
//   }
// }

const errorHandler = (err, req, res, next) => {
  let error;

  if (err.statusCode === 404) {
    error = new NotFound(err);
  } else {
    error = new InternalServerError(err);
  }

  res.status(err.statusCode).send({ message: error.message });
  next();
};

module.exports = errorHandler;
