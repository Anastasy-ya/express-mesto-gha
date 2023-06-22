const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return v;// дописать валидацию
      },
      message: 'Написать сообщение об ошибке',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId, // mongoose.Types.ObjectId,
    required: true,
    minlength: 2,
    maxlength: 30,
    ref: 'user',
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
