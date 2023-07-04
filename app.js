/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable no-console */
const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env; // переменная для порта
const app = express();
const mongoose = require('mongoose');
// const bodyParser = require('bodyParser'); был заменен на express.json
// создает наполнение req.body

const cors = require('cors');
const http2 = require('http2').constants;

const cardRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');
// const login = require('./controllers/users'); // эти два объединить
const {
  createUser,
  login,
} = require('./controllers/users');

// подключение к серверу монго
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// CORS
app.use(cors({
  origin: ['http://localhost: 3000'], // потом заменить адрес на постоянный
  credentials: true, // разрешить куки
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DEL'],
}));

app.use(express.json()); // создает наполнение req.body

app.use((req, res, next) => { // захардкодить id нового юзера
  req.user = {
    _id: '5d8b8592978f8bd833c13333',
  };

  next();
});

// console.log(mongoose);

app.post('/signin', login); // авторизация
app.post('/signup', createUser); // регистрация

// app.use('/signup', userRoutes);
// app.use('/signin', userRoutes);
app.use('/cards', cardRoutes); // получает роуты, в которых содержатся запросы и ответы на них
app.use('/users', userRoutes);
app.use('*', (req, res) => {
  res.status(http2.HTTP_STATUS_NOT_FOUND).send({ message: 'Page not Found' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
