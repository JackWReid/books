import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import DefaultView from './DefaultView';

export default class App extends Component {
  render() {
    return (
      <Router>
        <DefaultView />
      </Router>
    );
  }
}
