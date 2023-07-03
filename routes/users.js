const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  changeProfileData,
  changeProfileAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/me', changeProfileData);
router.patch('/me/avatar', changeProfileAvatar);

module.exports = router;
