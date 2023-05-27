const http2 = require('http2');

const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;
const userModel = require('../models/user');

const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Невозможно получить список пользователей',
      });
    });
};

const getUserById = (req, res) => {
  userModel
    .findById(req.params.id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Пользователя с указанным _id не существует',
        });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

const createUser = (req, res) => {
  userModel
    .create(req.body)
    .then((user) => {
      res.status(HTTP_STATUS_CREATED).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Указаны некорректные данные при создании пользователя',
        });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true, // обработчик then получит на вход обновленную запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновленную запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
