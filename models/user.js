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
    unique: true, // запрет добавления польз с дублирующим адресом не работает
    required: true,
    validate: [isEmail, 'Invalid Email'],
  },
  password: {
    type: String,
    select: false, // запрет обратной отправки не работает
    required: true,
    validate: [isStrongPassword, 'Password is too simple!'],
    // хавает любой пароль потому что предварительно хеширует его, это проблема
  },
});

module.exports = mongoose.model('user', userSchema);
