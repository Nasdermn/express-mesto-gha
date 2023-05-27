const http2 = require('http2');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;
const { isValidObjectId } = require('mongoose');
const cardModel = require('../models/card');

const getCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
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
      res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Указаны некорректные данные при создании карточки',
        });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};
/* eslint-disable consistent-return */
const removeCard = (req, res) => {
  if (!isValidObjectId(req.params.cardId)) {
    return res
      .status(HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные для удаления карточки' });
  }
  cardModel
    .deleteOne({ _id: req.params.cardId })
    .then(({ deletedCount }) => {
      if (!deletedCount) {
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'По указанному id карточка не найдена' });
      }
      return res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
    })
    .catch(() => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

const cardLike = (req, res) => {
  if (!isValidObjectId(req.params.cardId)) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({
      message: 'Переданы некорректный id пользователя для установки лайка',
    });
  }

  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    /* eslint-disable consistent-return */
    .then((card) => {
      if (!card) {
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Карточка не найдена' });
      }
      res.status(HTTP_STATUS_CREATED).send(card.likes);
    })
    .catch(() => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

const cardDislike = (req, res) => {
  if (!isValidObjectId(req.params.cardId)) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({
      message: 'Передан некорректный id пользователя для снятия лайка',
    });
  }

  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Карточка не найдена' });
      }
      res.status(HTTP_STATUS_OK).send(card.likes);
    })
    .catch(() => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports = {
  getCards,
  createCard,
  removeCard,
  cardLike,
  cardDislike,
};
