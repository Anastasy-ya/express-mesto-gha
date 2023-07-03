const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String, // mongoose.SchemaTypes.Url
    required: true,
    validate: {
      validator(v) {
        return v;// дописать валидацию
      },
      message: 'Написать сообщение об ошибке',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
