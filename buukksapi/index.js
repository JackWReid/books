const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const chalk = require('chalk');
const logger = require('morgan');
const app = express();
const bodyParser = require('body-parser');

const config = require('./config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());
app.use(compression());

const port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;
mongoose.connect(config.mongo);

app.use('/', require('./routes/base'));
app.use('/user', require('./routes/user'));
app.use('/book', require('./routes/book'));
app.use('/reading', require('./routes/reading'));

app.listen(port);
console.log(chalk.yellow(`Access at http://localhost:${port}`));
