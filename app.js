/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env; // переменная для порта
const app = express();
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser'); // был заменен на express.json
// создает наполнение req.body
const cors = require('cors');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/error');

// подключение к серверу монго
mongoose.connect(process.env['db.Link'], {
  useNewUrlParser: true,
});

// CORS
app.use(cors({
  origin: ['http://localhost: 3000'], // потом заменить адрес на постоянный
  credentials: true, // разрешить куки
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DEL'],
}));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // создает наполнение req.body
app.use(cookieParser());

// app.use((req, res, next) => { // захардкодить id нового юзера
//   req.user = {
//     _id: '64a52b1d2abb086865dcb54d',
//   };

//   next();
// });

app.use(routes);

app.use(errorHandler); // централизованный обработчик ошибок

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
