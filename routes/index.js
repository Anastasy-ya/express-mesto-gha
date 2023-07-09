const router = require('express').Router();
const http2 = require('http2').constants;
const {
  createUser,
  login,
} = require('../controllers/users');

const auth = require('../middlewares/auth');
const cardRoutes = require('./cards');
const userRoutes = require('./users');
const { celebrate, Joi } = require('celebrate');

<<<<<<< HEAD
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login); // авторизация
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/),
  }),
}), createUser); // регистрация
=======
router.post('/signin', login); // авторизация
router.post('/signup', createUser); // регистрация
>>>>>>> parent of 39c0750 (14 пр в процессе)

router.post('/signin', login); // авторизация
router.post('/signup', createUser); // регистрация

router.use(auth); // миддлвара проверяет наличие кук, располагается перед защищенными роутами

router.use('/cards', cardRoutes); // получает роуты, в которых содержатся запросы и ответы на них
router.use('/users', userRoutes);
router.use('*', (req, res) => {
  res.status(http2.HTTP_STATUS_NOT_FOUND).send({ message: 'Page not Found' });
});

module.exports = router;
