const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64721ad4b0f1980b91365b65',
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req, res) => {
  res
    .status(404)
    .send({ message: 'По указанному вами адресу страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
