/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable no-console */
const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env; // переменная для порта
const app = express();

const cookieParser = require('cookie-parser');

// const bodyParser = require('body-parser'); // был заменен на express.json
// создает наполнение req.body

const cors = require('cors');

const routes = require('./routes/index');

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

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // создает наполнение req.body
app.use(cookieParser());

// app.use((req, res, next) => { // захардкодить id нового юзера
//   req.user = {
//     _id: '5d8b8592978f8bd833c13333',
//   };

//   next();
// });

app.use(routes);
// console.log(mongoose);

// app.post('/signin', login); // авторизация
// app.post('/signup', createUser); // регистрация

// app.use(auth); // миддлвара проверяет наличие кук, располагается перед защищенными роутами

// app.use('/cards', cardRoutes); // получает роуты, в которых содержатся запросы и ответы на них
// app.use('/users', userRoutes);
// app.use('*', (req, res) => {
//   res.status(http2.HTTP_STATUS_NOT_FOUND).send({ message: 'Page not Found' });
// });

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
