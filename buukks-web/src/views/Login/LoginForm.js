import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { css } from 'glamor';
import Cookie from 'js-cookie';
import { login, encodeAuthToken } from '../../auth';
import { Label, TextInput, SubmitButton } from '../../components/Form';

export default class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      loginError: null,
      loading: false,
      token: null,
    };
  }

  handleFailedLogin = error => {
    this.setState({
      loginError: error,
      loading: false,
    });
  }

  handleLogin = user => {
    this.setState({
      loading: false,
      token: null,
    });
  };

  submitLogin = event => {
    event.preventDefault();
    this.setState({
      loginError: null,
      loading: true,
    });
    const token = encodeAuthToken(event.target.username.value, event.target.password.value);
    login(token, () => {
      this.handleLogin();
    });
  };

  render() {
    const { loginError, loading } = this.state;

    if (window.buukksStore.currentUser && Cookie.get('buukksAuth')) {
      browserHistory.push('/');
    }

    return (
      <form onSubmit={this.submitLogin} {...css({padding: '0 10px'})}>
        <Label>Username</Label>
        <TextInput name="username" placeholder="johndoe" required />
        <Label>Password</Label>
        <TextInput name="password" type="password" placeholder="Password" required />
        <div {...css({marginTop: '20px'})}>
          <SubmitButton>Login</SubmitButton>
        </div>
        { loading && <p>Loading...</p> }
        { loginError && <p>{loginError}</p> }
      </form>
    );
  }
}
