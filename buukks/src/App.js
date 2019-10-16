import React, { Component } from 'react';
import { BrowserRouter, Redirect, Match, Miss } from 'react-router';

import { Book, Home, Dashboard, Onboarding, People, Profile, NoMatch, About } from './views';

import { AppHeader, AppFooter } from './components';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  render() {
    const {
      currentUser,
      loginError,
      signUp,
      login,
      logout,
      updateUser,
    } = this.props.auth;

    return (
      <BrowserRouter>
        <div>
          <AppHeader user={currentUser} logout={logout} />
          <div>
            <Match exactly pattern="/" render={() => {
              if (currentUser && !currentUser.isOnboarded) { return <Redirect to="/onboarding" /> }
              return <Home user={currentUser} login={login} signUp={signUp} loginError={loginError} />
            }} />
            <Match exactly pattern="/dashboard" render={() => {
              if (!currentUser) { return <Redirect to="/" /> }
              if (!currentUser.isOnboarded) { return <Redirect to="/onboarding" /> }
              else { return <Dashboard user={currentUser} /> }
            }} />
            <Match exactly pattern="/onboarding" render={() => {
              if (currentUser && currentUser.isOnboarded) { return <Redirect to="/dashboard" /> }
              return <Onboarding user={currentUser} updateUser={updateUser} />
            }} />
            <Match exactly pattern="/people" component={People} />
            <Match exactly pattern="/people/:uid" component={Profile} />
            <Match exactly pattern="/book/:uid" component={Book} />
            <Match exactly pattern="/about" component={About} />
            <Miss component={NoMatch} />
          </div>
          <AppFooter />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
