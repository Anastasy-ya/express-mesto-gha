// const jsonWebToken = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const JsonWebTokenError = require('../errors/JsonWebTokenError');

const auth = (req, res, next) => {
  // const { authorization } = req.headers;
  // применяется если данные при регистрации переданы в заголовке, а у нас они в body.
  // if (!authorization || !authorization.startsWith('Bearer')) {
  //   throw new JsonWebTokenError('Unauthorized!');
  // }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, process.env['JWT.SECRET']);
    req.user = payload;
    return req.user;
  } catch (err) {
    return next(new JsonWebTokenError('Unauthorized!'));
  }
  // next(err);
};

module.exports = auth;
