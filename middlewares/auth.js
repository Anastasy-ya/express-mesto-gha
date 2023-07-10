// const jsonWebToken = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

const JsonWebTokenError = require('../errors/JsonWebTokenError');

const { NODE_ENV, JWT_SECRET } = process.env; //

const auth = (req, _, next) => {
  // const { authorization } = req.headers;
  // применяется если данные при регистрации переданы в заголовке, а у нас они в body.
  // if (!authorization || !authorization.startsWith('Bearer')) {
  //   throw new JsonWebTokenError('Unauthorized!');
  // }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new JsonWebTokenError('Unauthorized!')); //!
  }
  req.user = payload;
  next();
};

module.exports = auth;
