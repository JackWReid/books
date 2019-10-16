import config from '../config';
import { cookieToken } from '../auth';


export function finishBook({book, muted = false, callback, errorHandler}) {
  const configObject = {
    method: 'POST',
    headers: {
      'Authorization': cookieToken(),
    },
  };
  fetch(`${config.api}/book/${book}/finish?muted=${muted}`, configObject)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function startBook({book, callback, errorHandler}) {
  const configObject = {
    method: 'POST',
    headers: {
      'Authorization': cookieToken(),
    },
  };
  fetch(`${config.api}/book/${book}/start`, configObject)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}
