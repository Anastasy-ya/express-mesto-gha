const router = require('express').Router();
const http2 = require('http2').constants;

const {
  createUser,
  login,
} = require('../controllers/users');

const auth = require('../middlewares/auth');
const cardRoutes = require('./cards');
const userRoutes = require('./users');

router.post('/signin', login); // авторизация
router.post('/signup', createUser); // регистрация

router.use(auth); // миддлвара проверяет наличие кук, располагается перед защищенными роутами

router.use('/cards', cardRoutes); // получает роуты, в которых содержатся запросы и ответы на них
router.use('/users', userRoutes);
router.use('*', (req, res) => {
  res.status(http2.HTTP_STATUS_NOT_FOUND).send({ message: 'Page not Found' });
});

module.exports = router;
