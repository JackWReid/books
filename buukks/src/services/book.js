import config from '../config';


export function getBookById(uid, callback) {
  fetch(`${config.apiUrl}/book/${uid}`)
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => console.error(error));
}

export function getBooksByCreator(uid, callback) {
  fetch(`${config.apiUrl}/book/createdBy/${uid}`)
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => console.error(error));
}

export function createNewBook(token, bookData, callback) {
  fetch(`${config.apiUrl}/book`, {
    method: 'POST',
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
