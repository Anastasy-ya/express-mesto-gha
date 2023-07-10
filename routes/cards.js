const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCardById,
  addLike,
  removeLike,
} = require('../controllers/cards');
const {
  createCardValidation,
  CardIdValidation,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', createCardValidation, createCard);
router.delete('/:id', CardIdValidation, deleteCardById);
router.put('/:id/likes', CardIdValidation, addLike);
router.delete('/:id/likes', CardIdValidation, removeLike); //

module.exports = router;
