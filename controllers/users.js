/* eslint-disable no-console */
const http2 = require('http2').constants;
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');

// const ValidationError = require('../errors/ValidationError');
// const InternalServerError = require('../errors/InternalServerError');
// const NotFound = require('../errors/NotFound');

const getUsers = (req, res) => { // *
  User.find({})
    .then((user) => res.status(http2.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      res.status(http2.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
      // }
    });
};

const getUserById = (req, res) => { // *
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))// если возвращен пустой объект, создать ошибку
    // и потом выполнение кода перейдет в catch, где ошибка будет обработана
    .then((user) => res.status(http2.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(http2.HTTP_STATUS_NOT_FOUND).send({
          message: 'User ID is not found',
        });
      } else if (err.name === 'CastError') {
        res.status(http2.HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid user ID' });
        // return;
      } else {
        res.status(http2.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const createUser = (req, res) => { // добавить next в аргументы и вместо catch
  bcrypt.hash(req.body.password, 10) // пароль - только строка! 31min
  // соль стоит передавать в виде переменной и хранить ее отдельно при помощи специального модуля
    .then((hash) => User.create({
      ...req.body,
      password: hash,
    })
      .then((user) => res.status(http2.HTTP_STATUS_CREATED).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(http2.HTTP_STATUS_BAD_REQUEST).send({ message: 'One of the fields or more is not filled correctly' });
          return;
        }
        res.status(http2.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }));
};

const changeProfileData = (req, res) => { // *
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
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(http2.HTTP_STATUS_NOT_FOUND).send({
          message: 'Invalid user ID', // 400
        });
      } else if (err.name === 'ValidationError') {
        res.status(http2.HTTP_STATUS_BAD_REQUEST).send({ message: 'One of the fields or more is not filled correctly' });
        // return;
      } else {
        res.status(http2.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const changeProfileAvatar = (req, res) => { // *
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

const login = (req, res) => { // продолжение
  console.log(req, res);
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // аутентификация успешна
      return res.send({ message: 'Всё верно!' });// надо отправить jwt
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
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
