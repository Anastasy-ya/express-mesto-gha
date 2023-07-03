/* eslint-disable no-console */
const http2 = require('http2').constants;
const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const InternalServerError = require('../errors/InternalServerError');
const NotFound = require('../errors/NotFound');

const getUsers = (req, res) => { // *
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
      // }
    });
};

// const getUserById = (req, res) => { // *
//   User.findById(req.params.id)
//     .orFail(() => new Error('Not found'))// если возвращен пустой объект, создать ошибку
//     // и потом выполнение кода перейдет в catch, где ошибка будет обработана
//     .then((user) => res.status(200).send(user))
//     .catch((err) => {
//       if (err.message === 'Not found') {
//         res.status(404).send({
//           message: 'User ID is not found',
//         });
//       } else if (err.name === 'CastError') {
//         res.status(400).send({ message: 'Invalid user ID' });
//         // return;
//       } else {
//         res.status(500).send({
//           message: 'Internal Server Error',
//           err: err.message,
//           stack: err.stack,
//         });
//       }
//     });
// };

const getUserById = (req, res) => { // *
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))// если возвращен пустой объект, создать ошибку
    // и потом выполнение кода перейдет в catch, где ошибка будет обработана
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.send(new NotFound('User ID is not found'));
      } else if (err.name === 'CastError') {
        res.send(new ValidationError('Invalid user ID'));
        // return;
      } else {
        res.send(new InternalServerError('Internal Server Error'));
      }
    });
};

const createUser = (req, res) => {
  User.create({ ...req.body }) // возникает ошибка при добавлении req.user._id _id: req.user._id
    .then((user) => res.status(http2.HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'One of the fields or more is not filled correctly' });
        return;
      }
      res.status(500)
        .send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
    });
};

const changeProfileData = (req, res) => { // *
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(400).send({
          message: 'Invalid user ID',
        });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'One of the fields or more is not filled correctly' });
        // return;
      } else {
        res.status(500).send({
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
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Invalid user ID',
        });
      } else {
        res.status(500).send({
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
};
