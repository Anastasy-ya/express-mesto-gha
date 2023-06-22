/* eslint-disable no-console */
/* eslint-disable eol-last */

const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'User is not found'
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack
        });
      }
    });
};

const createUser = (req, res) => {
  User.create({ ...req.body, _id: req.user._id })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const changeProfileData = (req, res) => {
  console.log(req, res);
};

const changeProfileAvatar = (req, res) => {
  console.log(req, res);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeProfileData,
  changeProfileAvatar,
};