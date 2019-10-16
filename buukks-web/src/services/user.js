import config from '../config';
import { cookieToken, currentUser } from '../auth';

export function getUser({user, metaUser, callback, errorHandler}) {
  fetch(`${config.api}/user/${user}?meta_user=${metaUser || currentUser().id || ''}`)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function getReadingForUser({user, callback, errorHandler}) {
  fetch(`${config.api}/user/${user}/reading`)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function getUserFinishedBooks({user, limit = 20, offset = 0, callback, errorHandler}) {
  fetch(`${config.api}/user/${user}/finished_books?limit=${limit}&offset=${offset}`)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function searchUsers({query, callback, errorHandler}) {
  fetch(`${config.api}/user/search?q=${query}`)
  .then(result => result.json())
  .then(json => callback(json))
  .catch(error => errorHandler(error));
}

export function getMe({token = cookieToken(), callback, errorHandler}) {
  fetch(`${config.api}/user`, { headers: { 'Authorization': token } })
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => errorHandler(error));
}

export function signUpUser({requestBody, callback, errorHandler}) {
  const configObject = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      username: requestBody.username,
      first_name: requestBody.firstname,
      last_name: requestBody.lastname,
      email: requestBody.email,
      password: requestBody.password,
    }),
  };
  fetch(`${config.api}/user/`, configObject)
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => errorHandler(error));
}
