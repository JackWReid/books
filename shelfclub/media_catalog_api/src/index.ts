import express from 'express';
import morgan from 'morgan';

import {
  resolveBookAuthor,
  resolveBookEdition,
  resolveBookWork,
} from './resolvers/books';

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('combined'));

app.get('/book/author/:id', async (req, res) => {
  const queryId: string = req.params.id;
  const result = await resolveBookAuthor(queryId);
  res.send(result);
  
});
app.get('/book/edition/:id', async (req, res) => {
  const queryId: string = req.params.id;
  const result = await resolveBookEdition(queryId);
  res.send(result);
});

app.get(`/book/work/:id`, async (req, res) => {
  const queryId: string = req.params.id;
  const result = await resolveBookWork(queryId);
  res.send(result);
});

app.get('/health', async (req, res) => {
  return res.send({ message: 'OK' });
});

app.get('/', async (req, res) => {
  return res.send({ message: 'OK' });
});

app.get('*', async (req, res) => {
  return res.status(404).send({ message: 'Not Found' });
});

async function main() {
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
}

main();

