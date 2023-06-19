/* eslint-disable eol-last */
/* eslint-disable no-console */
/* eslint-disable max-len */
const cards = []; // далее эти данные получим из базы
let id = 0;

// req-запрос от фронтенда, res- ответ экспресса
// такой обработчик с входящими (req, res) называется контроллер
// обработчик с входящими (req, res, next) называются миддлвара
const getCards = (req, res) => {
  // console.log('загрузка данных главной страницы при входе начата');
  res.send(cards);
};

const createCard = (req, res) => {
  id += 1;
  const newCard = {
    id,
    ...req.body,
  };
  cards.push(newCard); // добавление новой карточки в массив карточек, это заменить обновлением бд
  res.status(201).send(newCard); // вернуть статус 201 и данные обратно на фронтенд
};

// динамический роут
// const getCardById = (req, res) => { // разобраться с повторным объявлением переменной id
//   const { _id } = req.params; // в req.params.id будет введенный пользователем id в виде строки
//   const card = cards.find((item) => item.id === Number(_id));
//   if (card) {
//     return res.send(card);
//   }
//   return res.status(404).send({ message: 'The card is not found' });
// };

const deleteCardById = (req, res) => {
  console.log(req, res);
};

const addLike = (req, res) => {
  console.log(req, res);
};

const removeLike = (req, res) => {
  console.log(req, res);
};

module.exports = {
  // getCardById,
  createCard,
  getCards,
  deleteCardById,
  addLike,
  removeLike,
};