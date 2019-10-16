import React from 'react';
import { style } from 'glamor';
import { field, label, input } from '../styles/forms';
import { linkLike } from '../styles/buttons';
import { PrimaryButton } from './buttons';

const LoginBox = ({user, login, signUp, isSignUpMode, toggle, loginError}) => {
  if (user) {
    return (
      <h1>Welcome home.</h1>
    );
  }

  const errorBox = () => {
    return (
      <div {...style({
        margin: '-10px 0 10px',
        textAlign: 'left',
        fontSize: '14px',
        height: '16px',
      })}>
        {loginError}
      </div>
    );
  }

  const loginForm = () => {
    return (
      <form onSubmit={login}>
        <div {...style(field)}>
          <label {...style(label)} htmlFor="username">Username</label>
          <input {...style(input)} id="username" />
        </div>
        <div {...style(field)}>
          <label {...style(label)} htmlFor="password">Password</label>
          <input {...style(input)} id="password" type="password" />
        </div>
        {errorBox()}
        <PrimaryButton type="submit">Login</PrimaryButton>
      </form>
    );
  }

  const signUpForm = () => {
    return (
      <form onSubmit={signUp}>
        <div {...style(field)}>
          <label {...style(label)} htmlFor="username">Username</label>
          <input {...style(input)} id="username" />
        </div>
        <div {...style(field)}>
          <label {...style(label)} htmlFor="password">Password</label>
          <input {...style(input)} id="password" type="password" />
        </div>
        {errorBox()}
        <PrimaryButton type="submit">Sign Up</PrimaryButton>
      </form>
    );
  }

  return (
    <div>
      { isSignUpMode ? signUpForm() : loginForm() }
      <button {...style(linkLike)} onClick={toggle}>
      { isSignUpMode ?
        <span>Already have an account? Log in.</span>
        : <span>Don't have an account? Sign up.</span>}
      </button>
    </div>
  );
}

export default LoginBox;
