const router = require('express').Router();
const {
  getUsers,
  getUserById,
  changeProfileData,
  changeProfileAvatar,
  // getMyData,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserById);
// router.get('/me', getMyData);
router.patch('/me', changeProfileData);
router.patch('/me/avatar', changeProfileAvatar);

module.exports = router;
