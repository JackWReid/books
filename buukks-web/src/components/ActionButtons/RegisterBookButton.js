import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { currentUser } from '../../auth';
import { registerBook } from '../../services';
import Button from '../Button';

export default class RegisterBookButton extends Component {
  registerBook = () => {
    const { book } = this.props;

    registerBook({
      book: book,
      errorHandler: error => console.error(error),
      callback: data => browserHistory.push(`/book/${data.id}`),
    });
  }

  render() {
    if (!currentUser())
      return null;

    return (
      <Button onClick={this.registerBook}>Register</Button>
    );
  }
}
