const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use(router);
app.use(errors());

app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).send({
    message: status === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
