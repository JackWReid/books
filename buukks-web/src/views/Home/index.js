import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { currentUser } from '../../auth';
import { css } from 'glamor';
import HomeFeed from './HomeFeed';
import GuestHome from './GuestHome';

export default class Home extends Component {
  render() {
    return (
      <div {...css({width: '100%'})}>
        <Helmet title="Home" />
        {currentUser() && <HomeFeed />}
        {!currentUser() && <GuestHome />}
      </div>
    );
  }
}
