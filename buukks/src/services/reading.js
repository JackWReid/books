import config from '../config';

export function getUserReading(uid, callback) {
  fetch(`${config.apiUrl}/reading/${uid}`)
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => console.error(error));
}

export function updateCurrentlyReading(token, bookData, callback) {
  fetch(`${config.apiUrl}/reading/current`, {
    method: 'PUT',
    body: JSON.stringify(bookData),
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => console.error(error));
}

export function getUsersByCurrentlyReading(uid, callback) {
  fetch(`${config.apiUrl}/book/${uid}/currentReaders`)
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => console.error(error));
}

export function finishCurrentlyReading(token, callback) {
  fetch(`${config.apiUrl}/reading/finish`, {
    method: 'PUT',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => console.error(error));
}
