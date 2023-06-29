const mongoose = require('mongoose');
const { isEmail, isURL } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Вася Пупкин',
  },
  about: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Сын маминой подруги',
  },
  avatar: { // Invalid avatar URL
    type: String, // mongoose.SchemaTypes.Url
    // required: true,
    default: 'https://github.com/Anastasy-ya',
    validate: [isURL, 'Invalid avatar URL'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'Invalid Email'],
  },
  password: {
    type: String,
    required: true,
    // validate: {
    //   validator(v) {
    //     return v;// дописать валидацию
    //   },
    //   message: 'Invalid password',
    // },
  },
});

module.exports = mongoose.model('user', userSchema);

// avatar: {
//   type: String,
//   default: '...',
//   validate: {
//     validator: (v) => urlRegExp.test(v),
//     message: 'Поле "avatar" должно быть валидным url-адресом.',
//   },
// },
