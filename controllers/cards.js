const { isValidObjectId } = require('mongoose');
const cardModel = require('../models/card');

const getCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(500).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

const createCard = (req, res) => {
  cardModel
    .create({
      owner: req.user._id,
      ...req.body,
    })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch(() => {
      res.status(400).send({
        message: 'Указаны некорректные данные при создании карточки',
      });
    });
};

const removeCard = (req, res) => {
  if (!isValidObjectId(req.params.cardId)) {
    return res
      .status(400)
      .send({ message: 'Переданы некорректные данные для удаления карточки' });
  }
  cardModel
    .deleteOne({ _id: req.params.cardId })
    .then(({ deletedCount }) => {
      if (!deletedCount) {
        return res
          .status(404)
          .send({ message: 'По указанному id карточка не найдена' });
      }
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const cardLike = (req, res) => {
  console.log(req.user);
  console.log(req.params);
  if (!isValidObjectId(req.user._id) || !isValidObjectId(req.params.cardId)) {
    return res
      .status(400)
      .send({ message: 'Переданы некорректные данные для установки лайка' });
  }

  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.status(201).send(card.likes);
    })
    .catch(() => {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const cardDislike = (req, res) => {
  if (!isValidObjectId(req.user._id) || !isValidObjectId(req.params.cardId)) {
    return res
      .status(400)
      .send({ message: 'Переданы некорректные данные для снятия лайка' });
  }

  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.status(200).send(card.likes);
    })
    .catch(() => {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports = {
  getCards,
  createCard,
  removeCard,
  cardLike,
  cardDislike,
};
