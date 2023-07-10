const { Joi, celebrate } = require('celebrate');

const regAvatar = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;
const reqEmail = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/;

const signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().pattern(reqEmail),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regAvatar),
  }),
});

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const changeProfileDataValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const changeProfileAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regAvatar),
  }),
});

module.exports = {
  signUpValidation,
  signinValidation,
  getUserByIdValidation,
  changeProfileDataValidation,
  changeProfileAvatarValidation,
};
