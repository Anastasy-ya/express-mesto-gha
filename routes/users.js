/* eslint-disable eol-last */
const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  changeProfileData,
  changeProfileAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/me', changeProfileData);
router.patch('/users/me/avatar', changeProfileAvatar);

module.exports = router;