/* eslint-disable max-len */
/* eslint-disable no-console */
const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env; // переменная для порта
const app = express();
const mongoose = require('mongoose');
// const bodyParser = require('bodyParser'); был заменен на express.json
// создает наполнение req.body

const cardRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');

app.use(express.json()); // создает наполнение req.body
app.use(cardRoutes); // получает роуты, в которых содержатся запросы и ответы на них
app.use(userRoutes);

// подключение к серверу монго
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false,
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
