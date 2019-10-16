import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Helmet from 'react-helmet';
import { css } from 'glamor';
import { AppNavigationOverlay, AppNavigationBar } from './components/AppNavigation/';
import {
  Home,
  Profile,
  ProfileFollowing,
  ProfileFollowers,
  ProfileFinished,
  ProfileRegistered,
  Book,
  Search,
  Collection,
  CreateCollection,
  Login,
} from './views';

class RootView extends Component {
  constructor() {
    super();
    this.state = {
      navigationOn: false,
    };
  }

  openNavigation = () => {
    this.setState({navigationOn: true});
  }

  closeNavigation = () => {
    this.setState({navigationOn: false});
  }

  render() {
    const { navigationOn } = this.state;

    return (
      <div>
        <AppNavigationBar open={this.openNavigation} />
        <div {...css({
          position: 'relative',
          display: 'flex',
          zIndex: '0',
          marginTop: '50px',
          minHeight: 'calc(100vh - 50px)',
          background: '#FFF',
        })}>
          {this.props.children}
        </div>
        { navigationOn && <AppNavigationOverlay close={this.closeNavigation} /> }
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <Helmet titleTemplate="%s | Buukks" />
        <Router history={browserHistory}>
          <Route path="/" component={RootView}>
            <IndexRoute component={Home} />
            <Route path="/book/:id" component={Book} />
            <Route path="/user/:id" component={Profile} />
            <Route path="/user/:id/following" component={ProfileFollowing} />
            <Route path="/user/:id/followers" component={ProfileFollowers} />
            <Route path="/user/:id/finished" component={ProfileFinished} />
            <Route path="/user/:id/registered" component={ProfileRegistered} />
            <Route path="/collection/create" component={CreateCollection} />
            <Route path="/collection/:id" component={Collection} />
            <Route path="/search" component={Search} />
            <Route path="/login" component={Login} />
          </Route>
        </Router>
      </div>
    );
  }
}

export default App;
