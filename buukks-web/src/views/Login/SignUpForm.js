import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { css } from 'glamor';
import Cookie from 'js-cookie';
import { login, encodeAuthToken } from '../../auth';
import { signUpUser } from '../../services';
import { Label, TextInput, SubmitButton } from '../../components/Form';

export default class SignUpForm extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      passwordconfirm: '',
    };
  }

  changeForm = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  submitSignUp = event => {
    event.preventDefault();
    const { state } = this;
    signUpUser({
      requestBody: state,
      errorHandler: error => console.error(error),
      callback: () => {
        login(encodeAuthToken(state.username, state.password), () => {
          browserHistory.push('/');
        });
      },
    });
  }

  render() {
    const { username, firstname, lastname, email, password, passwordconfirm } = this.state;

    if (window.buukksStore.currentUser && Cookie.get('buukksAuth')) {
      browserHistory.push('/');
    }

    return (
      <form onChange={this.changeForm} onSubmit={this.submitSignUp} {...css({padding: '0 10px'})}>
        <Label>Username</Label>
        <small>Lowercase letters only, no numbers</small>
        <TextInput name="username" placeholder="johndoe" pattern="^[a-z]{3,15}$" doValidate={username.length > 0} required />

        <Label>First Name</Label>
        <TextInput name="firstname" placeholder="johndoe" pattern="^[a-zA-Z]{2,20}$" doValidate={firstname.length > 0} required />

        <Label>Last Name</Label>
        <TextInput name="lastname" placeholder="johndoe" pattern="^[a-zA-Z]{2,20}$" doValidate={lastname.length > 0} required />

        <Label>Email</Label>
        <TextInput name="email" placeholder="john@doe.co" type="email" doValidate={email.length > 0} required />

        <Label>Password</Label>
        <small>Numbers or letters, 5 to 20 characters</small>
        <TextInput name="password" type="password" placeholder="Password" pattern="^[a-zA-Z0-9]{5,20}$" doValidate={password.length > 0} required />

        <Label>Password Again</Label>
        <TextInput name="passwordconfirm" type="password" placeholder="Password, again..." doValidate={passwordconfirm.length > 0} pattern="^[a-zA-Z0-9]{5,20}$" required />

        <div {...css({marginTop: '20px'})}>
          <SubmitButton>Register</SubmitButton>
        </div>
      </form>
    );
  }
}
