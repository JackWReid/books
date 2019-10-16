import React from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';

const BookImage = ({bookData, bookMeta}) => (
  <Link to={`/book/${bookData.id}`}>
    <div {...css({
      width: '100%',
      position: 'relative',
      zIndex: '1',
    })}>
      <img
        {...css({width: '100%'})}
        alt={bookData.title}
        src={bookData.image_url} />
      { bookMeta && bookMeta.isReading &&
        <div {...css({
          position: 'absolute',
          top: '0',
          padding: '5px',
          color: 'white',
          backgroundColor: '#EF4339',
          borderRadius: '0 0 5px 0',
        })}>
          Reading
        </div> }
    </div>
  </Link>
);

export default BookImage;
