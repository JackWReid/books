import express from 'express';
import graphqlHTTP from 'express-graphql';
import bodyParser from 'body-parser';

import logQuery from './logQuery';
import schema from './schema';

const app = express();

app.use(bodyParser.json());
app.use(logQuery);

app.use('/', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(3000, () => console.log('Listening on localhost:3000'));
