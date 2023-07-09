/* eslint-disable no-console */
const http2 = require('http2').constants;
const Card = require('../models/card');
// const ValidationError = require('../errors/ValidationError');
// const InternalServerError = require('../errors/InternalServerError');
const NotFound = require('../errors/NotFound');
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
        return res.status(http2.HTTP_STATUS_BAD_REQUEST).send({
          message: 'One of the fields or more is not filled correctly',
          err: err.message,
          stack: err.stack,
        });
      } return next(err);
    });
};

const deleteCardById = (req, res, next) => {
  console.log('req.params.id', req.params.id);
  Card.findById(req.params.id)
    .orFail(new NotFound('No card with such id.')) // не работает
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return new JsonWebTokenError('Недостаточно прав для удаления'); // работает но сообщение не отправляется
      }
      return Card.findByIdAndRemove(req.params.id);
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(http2.HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid user ID' });
      }
      return next(err);
    });
};

// const deleteCardById = (req, res, next) => {
//   console.log('req.params.id', req.params.id);
//   Card.findById(req.params.id)
//     .orFail(() => console.log('карточка не найдена'))
//     .then((card) => {
//       // console.log('card.owner.toString()',
// card.owner.toString(), 'req.user._id', req.user._id);
//       if (card.owner.toString() !== req.user._id) {
//         console.log('вы бесправны сударь в этом овпросе')
//       }
//         : Card.findByIdAndRemove(req.params.id)
//           .then(() => res.send({ message: 'Card removed' }))
//           .catch((err) => {
//             console.log(err);
//             return next(err);
//           })})
//     .catch(next);
// };

// const deleteCardById = (req, res, next) => {
//   Card.findById(req.params.id) // найти карту
//     .orFail(() => new Error('Not found')) // если не найдена, вернуть ошибку
//     .then((card) => {
//       if (card.owner !== req.user._id) { // проверить создателя карты
//         return next(new JsonWebTokenError());
//       }
//       return card.findByIdAndRemove().then(() => { // удалить карту
//         res.status(http2.HTTP_STATUS_OK).send('Card deleted'); // отправить 200 ок
//       });
//     })
//     .catch(next);

// {
//   if (err.message === 'Not found') { //
//     res.status(http2.HTTP_STATUS_NOT_FOUND).send({
//       message: 'Card ID is not found',
//     });
//   } else if (err.name === 'CastError') {
//     res.status(http2.HTTP_STATUS_BAD_REQUEST).send({
//       message: 'Invalid user ID',
//       err: err.message,
//       stack: err.stack,
//     });
//     // return;
//   } else {
//     res.status(http2.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
//       message: 'Internal Server Error',
//       err: err.message,
//       stack: err.stack,
//     });
//   }
// }
// );
// };

// const deleteCardById = (req, res, next) => {
// // непроверенный код запрещаем удаление кому попало
//   console.log()
//   Card.findById(req.params.id)
//     .orFail(() => new Error('Not found'))
//     .then((card) => {
//       if (!card.owner.equals(req.user._id)) {
//         // если карточка создана другим пользоватиелем
//         // выдать ошибку
//         return next(new JsonWebTokenError()); // проверить код ошибки
//       }
//       return card.deleteOne()
//         .then(() => res.status(http2.HTTP_STATUS_OK).send('Card removed'))
//         .catch(next);
//     })
//     .catch((err) => {
//       if (err.message === 'Not found') {
//         res.status(http2.HTTP_STATUS_NOT_FOUND).send({
//           message: 'Card ID is not found',
//         });
//       } else if (err.name === 'CastError') {
//         res.status(http2.HTTP_STATUS_BAD_REQUEST).send({
//           message: 'Invalid user ID',
//           err: err.message,
//           stack: err.stack,
//         });
//       } else if (err) {
//         res.send(err);
//       } else return next(err);
//     });
// };

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
    .orFail(() => new Error('Not found'))
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
