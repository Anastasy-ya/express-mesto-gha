/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');

const helmet = require('helmet');

const rateLimit = require('express-rate-limit');

const { errors } = require('celebrate');

const mongoose = require('mongoose');

const app = express(); // process.env.JWT_SECRET, process.env.NODE_ENV
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 мин
  max: 100, // максимум 100 обращений
});

const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser'); // был заменен на express.json
// создает наполнение req.body
const cors = require('cors');

const routes = require('./routes/index');

const errorHandler = require('./middlewares/error');

const { DB_URL = 'mongodb://127.0.0.1:27017/mestodb', PORT = 3000 } = process.env;

// подключение к серверу монго
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

// CORS
app.use(cors({
  origin: ['*'], // потом заменить адрес на постоянный
  credentials: true, // разрешить куки
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DEL'],
}));

// app.use(bodyParser.json()); // был заменен на express.json
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json()); // создает наполнение req.body

app.use(helmet()); // набор middleware функций для express,
// который помогает защитить приложение от уязвимостей и кибератак

app.use(limiter);

app.use(cookieParser());

app.use(routes);

app.use(errors());
// console.log(app.use(errors()));
app.use(errorHandler); // централизованный обработчик ошибок

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
