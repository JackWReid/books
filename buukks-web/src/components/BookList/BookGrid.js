import React from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';

const BookGridItem = ({book}) => (
  <Link
    {...css({
      display: 'block',
      width: '25%',
    })}
    to={`/book/${book.id}`}>
    <img
    {...css({
      display: 'block',
      width: '100%',
      objectFit: 'fill',
    })}
    src={book.image_url}
    alt={book.title} />
  </Link>
);

const BookGrid = ({books}) => (
  <div {...css({
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 auto',
  })}>
    {books.map((book, i) => <BookGridItem book={book} key={i} />)}
  </div>
);

export default BookGrid;
