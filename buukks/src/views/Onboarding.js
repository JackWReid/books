import React, { Component } from 'react';
import { style } from 'glamor';
import Cookies from 'js-cookie';

import { setUserAsOnboarded } from '../services/user';
import { createNewBook } from '../services/book';
import { updateCurrentlyReading } from '../services/reading';

import { EditCard } from '../components';

export default class Onboarding extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  submitOnboarding = event => {
    event.preventDefault();
    const { updateUser } = this.props;
    const { router } = this.context;
    const formData = event.target;
    const token = Cookies.get('buukksAuth');
    createNewBook(token, {
      title: formData.elements["title"].value,
      author: formData.elements["author"].value,
      link: formData.elements["link"].value,
    }, response => {
      updateCurrentlyReading(token, {
        bookId: response.publicId,
        sentiments: formData.elements["sentiments"].value,
      }, response => {
        setUserAsOnboarded(token, response => {
          if (!response.message) {
            updateUser(response);
          }
          router.replaceWith('/dashboard');
        });
      });
    });
  }

  render() {
    return <div {...style({margin: '0 10vw', padding: '20px 0', textAlign: 'center'})}>
      <h1>Welcome to Buukks</h1>
      <p>Let's get you set up with your first book. What are you reading right now?</p>
      <div {...style({marginTop: '50px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'left'})}>
        <EditCard save={this.submitOnboarding} />
      </div>
    </div>
  }
}
