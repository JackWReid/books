import React, { Component } from 'react';
import { css } from 'glamor';
import LoadingPanel from '../LoadingPanel';
import BookListItem from './BookListItem';

export default class BookList extends Component {
  render() {
    const {
      loading,
      books,
      compact = false,
      useShallow = false,
      ActionButton,
    } = this.props;

    if (loading) { return <LoadingPanel /> }

    if (!books)
      return null;

    return (
      <ul {...css({
        margin: '0',
        padding: '20px 10px',
        listStyle: 'none',
      })}>
        {books.map((book, index) => (
          <BookListItem
            book={book}
            key={index}
            compact={compact}
            useShallow={useShallow}>
            { ActionButton && <ActionButton /> }
          </BookListItem>
        ))}
      </ul>
    );
  }
}
