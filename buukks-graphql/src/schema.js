import { GraphQLSchema } from 'graphql';
import { Registry } from 'graphql-helpers';

import {
  getBookById,
  getUserById,
  getCollectionById,
  getCollectionBooks,
} from './resolvers';

const registry = new Registry();

registry.createType(`
  type Book {
    id: ID!
    title: String
    author: String
    description: String
    dateCreated: String
    registrant: User
  }
`, {
  registrant: ({registrant}) => getUserById({id: registrant}),
});

registry.createType(`
  type User {
    id: ID!
    username: String
    firstName: String
    lastName: String
    dateCreated: String
  }
`);

registry.createType(`
  type Collection {
    id: ID!
    title: String
    description: String
    dateCreated: String
    books: [Book]
  }
`, {
  books: ({id}) => getCollectionBooks({id}),
});

registry.createType(`
  type Query {
    book(id: Int!): Book
    user(id: Int!): User
    collection(id: Int!): Collection
  }
`, {
  book: (_, {id}) => getBookById({id}),
  user: (_, {id}) => getUserById({id}),
  collection: (_, {id}) => getCollectionById({id}),
});

const schema = new GraphQLSchema({
  query: registry.getType('Query'),
});

export default schema;
