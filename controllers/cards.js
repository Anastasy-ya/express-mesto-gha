/* eslint-disable no-console */
const http2 = require('http2').constants;
const Card = require('../models/card');
// const ValidationError = require('../errors/ValidationError');
// const InternalServerError = require('../errors/InternalServerError');
// const NotFound = require('../errors/NotFound');
const JsonWebTokenError = require('../errors/JsonWebTokenError');

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
        res.status(http2.HTTP_STATUS_BAD_REQUEST).send({
          message: 'One of the fields or more is not filled correctly',
          err: err.message,
          stack: err.stack,
        });
      } else return next(err);
    });
};

// ненужный роут может пригодиться в будущем
// const getCardById = (req, res) => { // разобраться с повторным объявлением переменной id
//   Card.findById(req.params.id)
//     .orFail(() => new Error('Not found'))
//     .then((card) => res.status(http2.HTTP_STATUS_OK).send(card))
//     .catch((err) => {
//       if (err.message === 'Not found') {
//         res.status(404).send({
//           message: 'Card is not found',
//         });
//       } else {
//         res.status(http2.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
//           message: 'Internal Server Error',
//           err: err.message,
//           stack: err.stack,
//         });
//       }
//     });
// };

const deleteCardById = (req, res, next) => {
// непроверенный код запрещаем удаление кому попало
  Card.findById(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) { //
        // выдать ошибку, проверить переменные
        return new JsonWebTokenError(); // проверить код ошибки
      }
      res.status(http2.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(http2.HTTP_STATUS_NOT_FOUND).send({
          message: 'Card ID is not found',
        });
      } else if (err.name === 'CastError') {
        res.status(http2.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Invalid user ID',
          err: err.message,
          stack: err.stack,
        });
      } else return next(err);
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
      res.status(http2.HTTP_STATUS_NOT_FOUND).send({
        message: 'Card is not found',
      });
    } else if (err.name === 'CastError') {
      res.status(http2.HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid user ID' });
      // return;
    } else return next(err);
  });

const removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(http2.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(http2.HTTP_STATUS_NOT_FOUND).send({
          message: 'Card is not found',
        });
      } else if (err.name === 'CastError') {
        res.status(http2.HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid user ID' });
        // return;
      } else return next(err);
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
