import React, { Component } from 'react';
import { css } from 'glamor';

export default class BookHeader extends Component {
  render() {
    const { book, user } = this.props;

    return (
      <div {...css({
        padding: '20px',
        textAlign: 'center',
        background: '#FFEFE6',
      })}>
        <div {...css({
          display: 'inline-block',
          margin: '0 auto',
          padding: '5px',
          fontSize: '10px',
          textAlign: 'center',
          backgroundColor: '#EF4339',
          color: 'white',
          textTransform: 'uppercase',
          borderRadius: '5px',
        })}>
          Book
        </div>
        <h1 {...css({
          margin: '10px 0 0 0',
          fontFamily: 'Inconsolata',
        })}>{book.title}</h1>
        <p>by {book.author}</p>
        { user && <p>{user.first_name} {user.last_name}</p> }
      </div>
    );
  }
}
