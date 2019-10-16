import config from '../config';
import { cookieToken, currentUser } from '../auth';

export function getBook({book, metaUser, callback, errorHandler}) {
  fetch(`${config.api}/book/${book}?meta_user=${metaUser || currentUser().id || ''}`)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function editBook({book, edits, callback, errorHandler}) {
  const configObject = {
    method: 'PATCH',
    headers: {
      'Authorization': cookieToken(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(edits),
  };
  fetch(`${config.api}/book/${book}`, configObject)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function getReviewsForBook({book, limit = 20, offset = 0, user = '', callback, errorHandler}) {
  fetch(`${config.api}/book/${book}/reviews?filter_user=${user}&limit=${limit}&offset=${offset}`)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function createReviewForBook({book, review, callback, errorHandler}) {
  const configObject = {
    method: 'POST',
    headers: {
      'Authorization': cookieToken(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      rating: review.rating,
      review: review.review,
    }),
  };

  fetch(`${config.api}/book/${book}/review`, configObject)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function searchBooks({query, callback, errorHandler}) {
  fetch(`${config.api}/book/search?q=${query}`)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function searchGoogleBooks({query, callback, errorHandler}) {
  fetch(`${config.api}/book/search_google?q=${query}`)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function getUserRegisteredBooks({user, limit = 20, offset = 0, callback, errorHandler}) {
  fetch(`${config.api}/user/${user}/registered_books?limit=${limit}&offset=${offset}`)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function registerBook({book, callback, errorHandler}) {
  const configObject = {
    method: 'POST',
    headers: {
      'Authorization': cookieToken(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      google_id: book,
    }),
  };

  fetch(`${config.api}/book/register`, configObject)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}
