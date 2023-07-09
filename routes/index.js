const router = require('express').Router();
const http2 = require('http2').constants;
const { celebrate, Joi } = require('celebrate');
const {
  createUser,
  login,
} = require('../controllers/users');

const auth = require('../middlewares/auth');
const cardRoutes = require('./cards');
const userRoutes = require('./users');

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
    avatar: Joi.string().pattern(/(https?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/),
  }),
}), createUser); // регистрация

router.use(auth); // миддлвара проверяет наличие кук, располагается перед защищенными роутами

router.use('/cards', cardRoutes); // получает роуты, в которых содержатся запросы и ответы на них
router.use('/users', userRoutes);
router.use('*', (req, res) => {
  res.status(http2.HTTP_STATUS_NOT_FOUND).send({ message: 'Page not Found' });
});

module.exports = router;
