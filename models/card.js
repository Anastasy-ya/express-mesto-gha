const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: mongoose.Types.Url, // возможна ошибка
    required: true,
    validate: {
      validator(v) {
        return v;// дописать валидацию
      },
      message: 'Написать сообщение об ошибке',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  likes: [{
    type: mongoose.Types.ObjectId,
    ref: 'user',
    default: [], // по умолчанию пустой массив
  }],
  createdAt: {
    type: Date,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
