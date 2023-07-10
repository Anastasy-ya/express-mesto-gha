/* eslint-disable no-console */
const http2 = require('http2').constants;
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const JsonWebTokenError = require('../errors/JsonWebTokenError');
const ValidationError = require('../errors/ValidationError');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');

const createUser = (req, res, next) => {
  const { email, password } = req.body;
  // чтобы не нагружать сервер проверим сразу наличие полей
  if (!email || !password) {
    return next(new ValidationError('One of the fields or more is not filled'));
  }
  return bcrypt.hash(req.body.password, 10) // пароль - только строка
    .then((hash) => {
      User.create({
        ...req.body,
        password: hash,
      })
        .then((user) => res.status(http2.HTTP_STATUS_CREATED).send(user))
        .catch((err) => {
          console.log(err);
          if (err.code === 11000) {
            return next(new ConflictError('User already exists')); // 409
          }
          return next(err);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  // Вытащить email и password
  const { email, password } = req.body;
  // чтобы не нагружать сервер проверим сразу наличие полей
  if (!email || !password) {
    return next(new ValidationError('One of the fields or more is not filled'));
  }
  // Проверить существует ли пользователь с таким email
  return User.findOne({ email })
    .select('+password')
    .orFail(() => new JsonWebTokenError('User not found'))
    .then((user) => {
      // Проверить совпадает ли пароль
      bcrypt.compare(password, user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            // создать JWT
            const jwt = jsonWebToken.sign({
              _id: user._id,
            }, process.env['JWT.SECRET']);
            // переменная окружения хранит секретое слово для создания куки
            // прикрепить его к куке
            res.cookie('jwt', jwt, {
              maxAge: 360000,
              httpOnly: true,
              sameSite: true,
            });
            // Если совпадает - вернуть пользователя без данных пароля
            return res.send({ data: user.toJSON() });
          }
          // Если не совпадает - вернуть ошибку
          return next(new Forbidden('Invalid email or password')); // 403 Неправильный пароль
        });
    })
    .catch(next);
};

const getUsers = (req, res, next) => { // *
  User.find({})
    .then((user) => res.status(http2.HTTP_STATUS_OK).send(user))
    .catch((err) => console.log(err)); // next
};

const getUserById = (req, res, next) => { // *
  // console.log(req.params.id);
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))// если возвращен пустой объект, создать ошибку
    // и потом выполнение кода перейдет в catch, где ошибка будет обработана
    .then((user) => res.status(http2.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        // return res.status(http2.HTTP_STATUS_NOT_FOUND).send({
        //   message: 'User ID is not found',
        // });
        throw new NotFound('User ID is not found');
      } if (err.name === 'CastError') {
        return next(new ValidationError('Invalid user ID'));
        // return res.status(http2.HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid user ID' });
      }
      return next(err);
    });
};

const changeProfileData = (req, res, next) => { // *
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
      email: req.body.email,
      password: req.body.password,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(http2.HTTP_STATUS_OK).send(user))
    .catch((err) => next(err));
  // {
  //   if (err.message === 'Not found') {
  //     res.status(http2.HTTP_STATUS_NOT_FOUND).send({
  //       message: 'Invalid user ID', // 400
  //     });
  //   } else if (err.name === 'ValidationError') {
  //     res.status(http2.HTTP_STATUS_BAD_REQUEST)
  // .send({ message: 'One of the fields or more is not filled correctly' });
  //     // return;
  //   } else {
  //     res.status(http2.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
  //       message: 'Internal Server Error',
  //       err: err.message,
  //       stack: err.stack,
  //     });
  //   }
  // });
};

const changeProfileAvatar = (req, res, next) => { // *
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(http2.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(http2.HTTP_STATUS_NOT_FOUND).send({
          message: 'Invalid user ID',
        });
      } else {
        res.status(http2.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeProfileData,
  changeProfileAvatar,
  login,
};
