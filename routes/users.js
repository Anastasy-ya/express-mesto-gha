const router = require('express').Router();
const {
  getUsers,
  getUserById,
  // createUser,
  changeProfileData,
  changeProfileAvatar,
  // login,
} = require('../controllers/users');

// router.post('/signup', createUser);
// router.post('/signin', login);
router.get('/', getUsers);
router.get('/:id', getUserById);
// router.post('/', createUser);
router.patch('/me', changeProfileData);
router.patch('/me/avatar', changeProfileAvatar);

module.exports = router;
