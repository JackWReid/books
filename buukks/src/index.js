import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthLayer from './AuthLayer';
import './index.css';
import './fonts/stylesheet.css';

ReactDOM.render(
  <AuthLayer>
  <App />
  </AuthLayer>,
  document.getElementById('root')
);
