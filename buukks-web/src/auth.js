import Cookie from 'js-cookie';
import { getMe } from './services';

window.buukksStore = {
  currentUser: null,
};

export function encodeAuthToken(username, password) {
  const basicToken = btoa(`${username}:${password}`);
  return `Basic ${basicToken}`;
}

export function cookieToken() {
  return Cookie.get('buukksAuth');
}

export function currentUser() {
  if (window.buukksStore.currentUser && Cookie.get('buukksAuth')) {
    return window.buukksStore.currentUser;
  } else {
    return false;
  }
}

export function login(token, callback) {
  function handleLogin(user) {
    Cookie.set('buukksAuth', token, { expires: 365 });
    window.buukksStore.currentUser = user;
    window.buukksStore.lastUserRefresh = new Date();
    if (callback)
      callback();
  }

  function handleFailedLogin(error) {
    Cookie.remove('buukksAuth');
    window.buukksStore.currentUser = null;
    window.buukksStore.lastUserRefresh = null;
  }

  return getMe({
    token,
    callback: user => handleLogin(user),
    errorHandler: error => handleFailedLogin(error),
  });
}

export function logout(callback) {
  Cookie.remove('buukksAuth');
  window.buukksStore.currentUser = null;
  window.buukksStore.lastUserRefresh = undefined;
  window.location.reload();
}
