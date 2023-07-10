// const { celebrate, Joi, errors } = require('celebrate');
const router = require('express').Router();
const {
  getUsers,
  getUserById,
  changeProfileData,
  changeProfileAvatar,
} = require('../controllers/users');
const {
  getUserByIdValidation,
  changeProfileDataValidation,
  changeProfileAvatarValidation,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/:id', getUserByIdValidation, getUserById);
router.get('/me', getUserByIdValidation, getUserById);
router.patch('/me', changeProfileDataValidation, changeProfileData);
router.patch('/me/avatar', changeProfileAvatarValidation, changeProfileAvatar);

module.exports = router;
