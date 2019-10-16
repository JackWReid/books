import React, { Component, Children, cloneElement } from 'react';
import Cookies from 'js-cookie';

import { getAuthToken, apiLogin } from './services/auth';
import { createNewUser } from './services/user';
import { initNotifications, notify } from './utils/notifications';

class AuthLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      authToken: null,
      loginError: null,
    }
  }

  componentWillMount() {
    initNotifications();
    const token = Cookies.get('buukksAuth');
    if (token) {
      apiLogin(token, user => {
        Cookies.set('buukksAuth', token);
        return this.setState({
          currentUser: user,
          loginError: null,
          authToken: token,
        });
      });
    }

    return this.clearLogin();
  }

  clearLogin = () => {
    Cookies.remove('buukksAuth');
    this.setState({
      currentUser: null,
      authToken: null,
      loginError: null,
    });
  }

  updateUser = user => {
    this.setState({ currentUser: user })
  }

  updateLoginError = message => {
    this.setState({ loginError: message });
  }

  setUser = (user, token) => {
    this.clearLogin();
    Cookies.set('buukksAuth', token);
    this.setState({ currentUser: user });
  }

  signUp = event => {
    event.preventDefault();
    const token = getAuthToken(event.target.username.value, event.target.password.value);

    createNewUser({
      username: event.target.username.value,
      password: event.target.password.value,
    }, response => {
      if (response.message) {
        this.clearLogin();
        this.updateLoginError(response.message);
      }

      this.setUser(response, token);
      notify(
        `Welcome to Buukks, ${response.username}!`,
        `/people/${response.publicId}`
      );
    });
  }

  login = event => {
    event.preventDefault();
    const token = getAuthToken(event.target.username.value, event.target.password.value);

    apiLogin(token, response => {
      if (response.message) {
        return this.updateLoginError(response.message);
      }
      Cookies.set('buukksAuth', token);
      this.setState({
        currentUser: response,
        loginError: null,
        authToken: token,
      });
    });
  }

  logout = event => {
    event.preventDefault()
    this.clearLogin();
  }

  render() {
    const { children } = this.props;

    const authMethods = {
      updateUser: this.updateUser,
      updateLoginError: this.updateLoginError,
      setUser: this.setUser,
      signUp: this.signUp,
      login: this.login,
      logout: this.logout,
      currentUser: this.state.currentUser,
      loginError: this.state.loginError,
    };

    const boundChildren = Children.map(children, child => {
      return cloneElement(child, {auth: authMethods});
    });

    return <div>{boundChildren}</div>
  }
}

export default AuthLayer;
