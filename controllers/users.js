const userModel = require('../models/user');

const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(500).send({
        message: 'Невозможно получить список пользователей',
      });
    });
};

const getUserById = (req, res) => {
  console.log(req.params);
  userModel
    .findById(req.params.id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: '_id пользователя указан некорректно',
        });
      }
      return res.status(500).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

const createUser = (req, res) => {
  userModel
    .create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch(() => {
      res.status(500).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

const updateUser = (req, res) => {
  console.log(req.user);
  console.log(req.body);
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
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res.status(500).send({
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
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }
      return res.status(500).send({
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
