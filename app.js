/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env; // переменная для порта
const app = express(); // process.env.JWT_SECRET, process.env.NODE_ENV
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser'); // был заменен на express.json
// создает наполнение req.body
const cors = require('cors');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/error');
// const getData = require('./controllers/users');

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

// app.use(bodyParser.json()); // был заменен на express.json
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json()); // создает наполнение req.body

app.use(cookieParser());

app.use(routes);

app.use(errors());

app.use(errorHandler); // централизованный обработчик ошибок

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
