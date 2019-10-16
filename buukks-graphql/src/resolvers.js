import api from './apiRequest';

import {
  transformBook,
  transformUser,
  transformCollection,
} from './transforms';

export async function getBookById({ id }) {
  const response = await api(`book/${id}`);
  const json = await response.json();
  return transformBook(json.book);
}

export async function getUserById({ id }) {
  const response = await api(`user/${id}`);
  const json = await response.json();
  return transformUser(json.user);
}

export async function getCollectionById({ id }) {
  const response = await api(`collection/${id}`);
  const json = await response.json();
  return transformCollection(json);
}

export async function getCollectionBooks({ id }) {
  const response = await api(`collection/${id}/books`);
  const json = await response.json();
  return json.map(book => transformBook(book));
}
