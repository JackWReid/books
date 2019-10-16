import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { css } from 'glamor';
import { BoundingColumn } from '../../components';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: props.location.query.mode || 'login',
    };
  }

  render() {
    const { mode } = this.state;
    return (
      <div {...css({width: '100%'})}>
        <Helmet title={ mode === 'login' ? 'Login' : 'Sign Up'} />
        <h1 {...css({textAlign: 'center'})}>{ mode === 'login' ? 'Login' : 'Sign Up'}</h1>
        <BoundingColumn>
          {mode === 'login' && <LoginForm />}
          {mode === 'signup' && <SignUpForm />}
        </BoundingColumn>
      </div>
    );
  }
}
