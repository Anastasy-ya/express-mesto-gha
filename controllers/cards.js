/* eslint-disable no-console */
const http2 = require('http2').constants;
const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

const getCards = (_, res, next) => {
  Card.find({})
    .then((card) => res.status(http2.HTTP_STATUS_OK).send(card))
    .catch(next);
};

const createCard = (req, res, next) => {
  Card.create({ ...req.body, owner: req.user.id })
    .then((card) => res.status(http2.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Invalid card ID'));
      }
      return next(err);
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(new NotFound('Card is not found'))
    .then((card) => {
      if (card.owner.toString() !== req.user.id) {
        throw new Forbidden('Access is denied');
      }
      return Card.deleteOne(card);
    })
    .then(() => res.send({ message: 'Card removed' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Invalid card ID'));
      }
      return next(err);
    });
};

const addLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user.id } },
  { new: true },
)
  .orFail(() => new NotFound('Card ID is not found'))
  .then((card) => res.status(http2.HTTP_STATUS_OK).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new ValidationError('Invalid card ID'));
    } return next(err);
  });

const removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user.id } },
    {
      new: true,
    },
  )
    .orFail(() => new NotFound('Card ID is not found'))
    .then((card) => res.status(http2.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Invalid card ID'));
      } return next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  addLike,
  removeLike,
};
