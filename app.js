const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
