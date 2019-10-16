import fetch from 'node-fetch';
import knex from './db/connection';

export function publicUser(table = 'users') {
  if (table === false) {
    return [
      'id',
      'username',
      'first_name',
      'last_name',
      'bio',
      'admin',
      'created_at',
    ];
  }

  return [
    `${table}.id`,
    `${table}.username`,
    `${table}.first_name`,
    `${table}.last_name`,
    `${table}.bio`,
    `${table}.admin`,
    `${table}.created_at`,
  ];
}

export function stripHTML(string) {
  return string.replace(/<(?:[^>=]|='[^']*'|="[^"]*"|=[^'"][^\s>]*)*>/, '');
}

export function filterObject(object, validKeys) {
  const filteredKeys = Object.keys(object).filter((key) => {
    return validKeys.includes(key);
  });

  const filterObject = {};
  for (var index in filteredKeys) {
    filterObject[filteredKeys[index]] = object[filteredKeys[index]];
  }

  return filterObject;
}

export function selectBestGoogleBooksImage(imageLinks) {
  const keyList = [
    'extraLarge',
    'large',
    'medium',
    'small',
    'thumbnail',
    'smallThumbnail'
  ];

  if (!imageLinks)
    return false;

  for (let keyListIndex in keyList) {
    if (typeof imageLinks[keyList[keyListIndex]] !== 'undefined') {
      return imageLinks[keyList[keyListIndex]];
    }
  }

  return false;
}

export function parseGoogleBooksDescription(description) {
  return description || false;
}

export function getGoogleBooksInfo(id, callback) {
  fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
  .then(response => response.json())
  .then(json => {
    return callback({
      title: json.volumeInfo.title || null,
      author: json.volumeInfo.author || json.volumeInfo.authors[0] || null,
      image_url: selectBestGoogleBooksImage(json.volumeInfo.imageLinks) || null,
      description: parseGoogleBooksDescription(json.volumeInfo.description) || null,
    })
    .catch(error => console.error(error));
  });
}

export function isValidUserId(id) {
  if (isNaN(id)) {
    return false;
  } else if (!Number.isInteger(parseFloat(id))) {
    return false;
  } else {
    return true;
  }
}

export function ifBookExists(id, callback) {
  knex.table('books')
  .first('id')
  .where({id})
  .then(book => callback(!!book))
  .catch(error => {
    console.error(error);
    return callback(false);
  });
}
