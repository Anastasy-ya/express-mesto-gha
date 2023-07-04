const mongoose = require('mongoose');
const { isEmail, isURL, isStrongPassword } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
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
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
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
    validate: [isStrongPassword, 'Password is too simple!'],
    minlength: 8,
  },
});

module.exports = mongoose.model('user', userSchema);
