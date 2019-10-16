import config from '../config';
import { cookieToken } from '../auth';

export function getFeed({callback, errorHandler}) {
  fetch(`${config.api}/feed?actor=others`, { headers: { 'Authorization': cookieToken() } })
  .then(response => response.json())
  .then(response => callback(response))
  .catch(error => errorHandler(error));
}
