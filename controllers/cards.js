/* eslint-disable object-curly-newline */
/* eslint-disable eol-last */
/* eslint-disable no-console */
/* eslint-disable max-len */
const Card = require('../models/card');

// req-запрос от фронтенда, res- ответ экспресса
// такой обработчик с входящими (req, res) называется контроллер
// обработчик с входящими (req, res, next) называются миддлвара
const getCards = (req, res) => { // *
  Card.find({})
    // .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      // if (err.message === 'Not found') {
      //   res.status(404).send({
      //     message: 'Card is not found',
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

const createCard = (req, res) => { // *
  // console.log('req.params', req.params, 'req.user', req.user, 'req.body', req.body);
  Card.create({ ...req.body, owner: req.user._id })
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'One of the fields or more is not filled correctly',
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

// динамический роут понадобится для пользователей
// const getCardById = (req, res) => { // разобраться с повторным объявлением переменной id
//   Card.findById(req.params.id)
//     .orFail(() => new Error('Not found'))
//     .then((card) => res.status(200).send(card))
//     .catch((err) => {
//       if (err.message === 'Not found') {
//         res.status(404).send({
//           message: 'Card is not found',
//         });
//       } else {
//         res.status(500).send({
//           message: 'Internal Server Error',
//           err: err.message,
//           stack: err.stack,
//         });
//       }
//     });
// };

const deleteCardById = (req, res) => { // 400
  // console.log('req.params', req.params, 'req.user', req.user, 'req.body', req.body);
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Card ID is not found',
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

const addLike = (req, res) => Card.findByIdAndUpdate( // 400
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => new Error('Not found'))
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.message === 'Not found') {
      res.status(404).send({
        message: 'Card is not found',
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

const removeLike = (req, res) => { // 400
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Card is not found',
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

module.exports = {
  // getCardById, // удалить
  createCard,
  getCards,
  deleteCardById,
  addLike,
  removeLike,
};