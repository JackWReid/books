import React, { Component } from 'react';
import { style } from 'glamor';

import { LoginBox } from '../components';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignUpMode: false,
    }
  }

  toggleSignUp(event) {
    event.preventDefault();
    this.setState({ isSignUpMode: !this.state.isSignUpMode});
  }

  render() {
    const { isSignUpMode } = this.state;
    const { login, signUp, user, loginError } = this.props;

    return (
      <div {...style({
        minHeight: 'calc(100vh - 85px)',
        backgroundColor: '#FFEFE6',
      })}>
        <div {...style({
          position: 'relative',
          zIndex: '1',
          height: '30vh',
          backgroundColor: '#FFDBC5',
        })} />
        <div {...style({
          position: 'relative',
          zIndex: '2',
          margin: '-100px auto 0',
          height: '200px',
          width: '200px',
          textAlign: 'center',
          borderRadius: '50%',
          color: 'white',
          backgroundColor: '#EF4339',
        })} />
        <div {...style({
          marginTop: '-100px',
          padding: '5px',
          position: 'relative',
          height: 'calc(70vh - 100px)',
          zIndex: '3',
          color: '#2E112D',
          textAlign: 'center',
          backgroundColor: '#FFEFE6',
        })}>
          <div {...style({maxWidth: '500px', margin: '0 auto'})}>
            <h1 {...style({
              fontFamily: 'Maison Neue, sans-serif',
            })}>Welcome to Buukks</h1>
            <p>What are you reading right now?</p>
            <LoginBox
              user={user}
              isSignUpMode={isSignUpMode}
              login={login}
              signUp={signUp}
              loginError={loginError}
              toggle={this.toggleSignUp.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
