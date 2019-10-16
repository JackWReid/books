import config from '../config';

export function getAuthToken(username, password) {
  const basicToken = btoa(`${username}:${password}`);
  return `Basic ${basicToken}`;
}

export function apiLogin(token, callback) {
  fetch(`${config.apiUrl}/user/me`, { headers: { 'Authorization': token } })
  .then(response => {
    if (response.status === 401)
      return callback({message: 'Username or password incorrect'});
    return response.json();
  })
  .then(response => callback(response))
  .catch(error => console.error(error));
}
