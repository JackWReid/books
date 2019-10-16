import config from '../config';
import { cookieToken } from '../auth';

export function createCollection({collection, callback, errorHandler}) {
  const configObject = {
    method: 'POST',
    headers: {
      'Authorization': cookieToken(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      title: collection.title,
      description: collection.description,
    }),
  };

  fetch(`${config.api}/collection`, configObject)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function addBookToCollection({book, collection, callback, errorHandler}) {
  const configObject = {
    method: 'POST',
    headers: {
      'Authorization': cookieToken(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  fetch(`${config.api}/collection/${collection}/add/${book}`, configObject)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function removeBookFromCollection({book, collection, callback, errorHandler}) {
  const configObject = {
    method: 'DELETE',
    headers: {
      'Authorization': cookieToken(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  fetch(`${config.api}/collection/${collection}/add/${book}`, configObject)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function getUserCollections({user, callback, errorHandler}) {
  fetch(`${config.api}/user/${user}/collections`)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function getCollection({collection, callback, errorHandler}) {
  fetch(`${config.api}/collection/${collection}`)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function getCollectionBooks({collection, limit = 20, offset = 0, callback, errorHandler}) {
  fetch(`${config.api}/collection/${collection}/books?limit=${limit}&offset=${offset}`)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}
