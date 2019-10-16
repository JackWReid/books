import { GraphQLSchema } from 'graphql';
import { Registry } from 'graphql-helpers';

import {
  getBookById,
  getBookSearch,
} from './resolvers';

const registry = new Registry();

registry.createType(`
  type Book {
    id: ID!
    title: String
    subtitle: String
    authors: [String]
    image: String
    pageCount: Int
  }
`);

registry.createType(`
  type BookSearchResults {
    count: Int
    books: [Book]
  }
`);

registry.createType(`
  type Query {
    book(id: String!): Book
    bookSearch(query: String!): BookSearchResults
  }
`, {
  book: (_, {id}) => getBookById({id}),
  bookSearch: (_, {query}) => getBookSearch({query}),
});

const schema = new GraphQLSchema({
  query: registry.getType('Query'),
});

export default schema;
