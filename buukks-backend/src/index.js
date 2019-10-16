import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';

import { base, admin, user, book, collection, feed } from './routes';

const app = express();

const environment = process.env.NODE_ENV;
app.use(morgan(environment === 'production' ? 'combined' : 'dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors());
app.use(compression());

app.use('/', base);
app.use('/admin', admin);
app.use('/user', user);
app.use('/book', book);
app.use('/collection', collection);
app.use('/feed', feed);

app.listen(process.env.PORT || 8080);
