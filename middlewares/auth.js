// const jsonWebToken = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const JsonWebTokenError = require('../errors/JsonWebTokenError');

const auth = (req, res, next) => {
  // const { authorization } = req.headers;
  // применяется если данные переданы в заголовке, а у нас они в body. Но это не точно
  // if (!authorization || !authorization.startsWith('Bearer')) {
  //   throw new JsonWebTokenError('Unauthorized!');
  // }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, process.env['JWT.SECRET']);
  } catch (err) {
    throw new JsonWebTokenError('Unauthorized!');
  }

  req.user = payload;
  next();
};

module.exports = auth;
