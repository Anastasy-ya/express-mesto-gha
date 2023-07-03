const router = require('express').Router();
const {
  // getCardById, // удалить
  createCard,
  getCards,
  deleteCardById,
  addLike,
  removeLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', deleteCardById);
router.put('/:id/likes', addLike);
router.delete('/:id/likes', removeLike);

// динамический роут удалить
// router.get('/cards/:id', getCardById);

module.exports = router;
