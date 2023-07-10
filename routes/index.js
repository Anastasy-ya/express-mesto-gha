const router = require('express').Router();
const NotFound = require('../errors/NotFound');
const {
  createUser,
  login,
} = require('../controllers/users');
const {
  signUpValidation,
  signinValidation,
} = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const cardRoutes = require('./cards');
const userRoutes = require('./users');

router.post('/signin', signinValidation, login); // авторизация
router.post('/signup', signUpValidation, createUser); // регистрация

router.use(auth); // миддлвара проверяет наличие кук, располагается перед защищенными роутами

router.use('/cards', cardRoutes); // получает роуты, в которых содержатся запросы и ответы на них
router.use('/users', userRoutes);
router.use('*', (_, _, next) => {
  throw next(new NotFound('Page not found'));
});

module.exports = router;
