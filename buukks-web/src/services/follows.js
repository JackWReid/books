import config from '../config';

export function getUserFollowing({user, callback, errorHandler}) {
  fetch(`${config.api}/user/${user}/following`)
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => errorHandler(error));
}

export function getUserFollowers({user, callback, errorHandler}) {
  fetch(`${config.api}/user/${user}/followers`)
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => errorHandler(error));
}

export function followUser({token, user, callback, errorHandler}) {
  fetch(`${config.api}/user/follow/${user}`, { headers: { 'Authorization': token }, method: 'POST' })
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => errorHandler(error));
}

export function unfollowUser({token, user, callback, errorHandler}) {
  fetch(`${config.api}/user/follow/${user}`, { headers: { 'Authorization': token }, method: 'DELETE' })
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => errorHandler(error));
}
