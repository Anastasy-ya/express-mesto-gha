const router = require('express').Router();
const {
  getUsers,
  getUserById,
  changeProfileData,
  changeProfileAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/me', changeProfileData);
router.patch('/me/avatar', changeProfileAvatar);

module.exports = router;
