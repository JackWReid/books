import config from '../config';


export function createNewUser(userData, callback) {
  fetch(`${config.apiUrl}/user`, {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => console.error(error));
}

export function setUserAsOnboarded(token, callback) {
  fetch(`${config.apiUrl}/user/onboarded`, {
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

export function getAllUsers(callback) {
  fetch(`${config.apiUrl}/user`)
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => console.error(error));
}

export function getUserByUid(uid, callback) {
  fetch(`${config.apiUrl}/user/${uid}`)
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => console.error(error));
}
