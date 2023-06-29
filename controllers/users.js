/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable eol-last */

const User = require('../models/user');
const bcrypt = require('bcrypt');

const getUsers = (req, res) => { // *
  User.find({})
    // .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      // if (err.message === 'Not found') {
      //   res.status(404).send({
      //     message: 'Users is not found', // incorrect data
      //   });
      // } else {
      res.status(500).send({
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
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      // console.log(err);
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'User ID is not found',
        });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid user ID' });
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

const createUser = (req, res) => {
  console.log(req);
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      ...req.body,
      _id: req.user._id, //
      password: hash,
    }) // возникает ошибка при добавлении req.user._id
    .then(() => console.log(req.body))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ err, message: 'One of the fields or more is not filled correctly' });
          return;
        }
        res.status(500)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
        })
    )
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