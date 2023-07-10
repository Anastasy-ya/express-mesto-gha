/* eslint-disable no-console */
const http2 = require('http2').constants;
const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
// const InternalServerError = require('../errors/InternalServerError');
const NotFound = require('../errors/NotFound');
// const JsonWebTokenError = require('../errors/JsonWebTokenError');
const Forbidden = require('../errors/Forbidden');

const getCards = (req, res, next) => { // *
  // console.log(http2);
  Card.find({})
    .then((card) => res.status(http2.HTTP_STATUS_OK).send(card))
    .catch(next);
};

const createCard = (req, res, next) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((card) => res.status(http2.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.HTTP_STATUS_BAD_REQUEST).send({
          message: 'One of the fields or more is not filled correctly',
          err: err.message,
          stack: err.stack,
        });
      } return next(err);
    });
};

const deleteCardById = (req, res, next) => {
  // console.log('req.params.id', req.params.id);
  Card.findById(Number(req.params.id))
    .orFail(new NotFound('Card is not found')) // не работает
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden('Access is denied'); // работает но сообщение не отправляется
      }
      return Card.findByIdAndRemove(req.params.id);
    })
    .then((card) => res.send(card))
    .catch((err) => {
      // console.log(err);
      if (err.name === 'CastError') {
        return next(new ValidationError('Invalid user ID'));
        // return res.status(http2.HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid user ID' });
      }
      return next(err);
    });
};

const addLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => new Error('Not found'))
  .then((card) => res.status(http2.HTTP_STATUS_OK).send(card))
  .catch((err) => {
    if (err.message === 'Not found') {
      return res.status(http2.HTTP_STATUS_NOT_FOUND).send({
        message: 'Card is not found',
      });
    } if (err.name === 'CastError') {
      return res.status(http2.HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid user ID' });
      // return;
    } return next(err);
  });

const removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail(() => new Error('Not  found'))
    .then((card) => res.status(http2.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        return res.status(http2.HTTP_STATUS_NOT_FOUND).send({
          message: 'Card is not found',
        });
      } if (err.name === 'CastError') {
        return res.status(http2.HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid user ID' });
      } return next(err);
    });
};

module.exports = {
  // getCardById, // удалить
  createCard,
  getCards,
  deleteCardById,
  addLike,
  removeLike,
};
