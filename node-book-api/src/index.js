import express from 'express';
import Router from 'express-promise-router';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import database from './db';
import getBooks from './handlers/getBooks';
import getBookById from './handlers/getBookById';
import patchBookById from './handlers/patchBookById';
import currentlyReading from './handlers/currentlyReading';
import auth from './auth';

const server = express();
const router = Router();

router.get('/books', getBooks);
router.get('/books/reading', currentlyReading);
router.get('/books/:id', getBookById);
router.patch('/books/:id', auth, patchBookById);
router.post('/books', auth, (req, res) => res.json({ message: 'post book' }));
router.get('/health', (req, res) => res.json({ message: 'ok' }));
router.get('/', (req, res) => res.json({ message: 'ok' }));
router.get('*', (req, res) => res.status(404).json({ message: 'Not Found' }));

server.use(morgan('combined'));
server.use(cors());
server.use(bodyParser.json());
server.use('/', router);

async function dbconnect() {
  try {
    await database.connect();
  } catch (error) {
    console.error('Error: Database failed to connect');
    console.error(error);
  }
  console.info('Database connected');
}

dbconnect();

server.listen(3000);
