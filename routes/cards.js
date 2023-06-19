/* eslint-disable eol-last */
const router = require('express').Router();
const {
  // getCardById,
  createCard,
  getCards,
  deleteCardById,
  addLike,
  removeLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:id', deleteCardById);
router.put('/cards/:id/likes', addLike);
router.delete('/cards/:id/likes', removeLike);

// динамический роут
// router.get('/:id', getCardById);

module.exports = router;