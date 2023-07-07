// const jsonWebToken = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

// console.log('req.cookies', req.cookies);
const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log('token', token);
  let payload;

  try {
    payload = jwt.verify(token, process.env['JWT.SECRET']);
  } catch (err) {
    next(err);
  }

  req.user = payload;
  next();
};

module.exports = auth;
