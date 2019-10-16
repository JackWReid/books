import React, { Component } from 'react';
import { BookCard } from './';

class BookList extends Component {
  render() {
    const { list } = this.props;
    return (
      <div>
        { list.map((book, iterator) => {
          return <BookCard
            book={book.bookId}
            sentiments={book.sentiments}
            key={iterator} />
        })}
      </div>
    );
  }
}

export default BookList;
