import api from './apiRequest';

import {
  transformBook,
} from './transforms';

export async function getBookById({ id }) {
  const response = await api(`volumes/${id}`);
  const json = await response.json();
  return transformBook(json);
}

export async function getBookSearch({ query }) {
  const response = await api(`volumes?q=${query}`);
  const json = await response.json();
  return {
    count: json.totalItems,
    books:  json.items.map(book => transformBook(book))
  }
}
