import React from 'react';
import ReactDOM from 'react-dom';
import Cookie from 'js-cookie';
import { login } from './auth';
import App from './App';
import './index.css';

function mount() {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}

if (Cookie.get('buukksAuth') && !window.buukksStore.currentUser) {
  login(Cookie.get('buukksAuth'), () => {
    mount();
  })
} else {
  mount();
}
