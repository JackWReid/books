import React, { Component } from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';
import { distanceInWordsToNow } from 'date-fns';
import { fadeString } from '../../utils';
import { getReviewsForBook } from '../../services';
import ReviewList from '../ReviewList';
import { BookImage } from '../Images';

export default class ActivityListItem extends Component {
  constructor() {
    super();
    this.state = {
      bookReviews: null,
    };
  }

  componentWillMount() {
    const { type, book, user } = this.props.activity;
    if (type === 'finished') {
      getReviewsForBook({
        book: book.id,
        user: user.id,
        errorHandler: error => console.error(error),
        callback: bookReviews => this.setState({bookReviews}),
      });
    }
  }

  render() {
    const { user, book, type, created_at } = this.props.activity;
    const { bookReviews } = this.state;

    return (
      <div {...css({margin: '20px 0 0', backgroundColor: '#FFEFE6'})}>
        <div {...css({
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          padding: '10px',
          backgroundColor: '#FFDBC5',
          '@media(max-width: 500px)': {
            display: 'block',
          },
        })}>
          <p {...css({
            margin: '0',
            '@media(max-width: 500px)': {
              marginBottom: '10px',
            },
          })}>
            <Link to={`/user/${user.username}`}>
              {user.first_name} {user.last_name}
            </Link> {type === 'finished' ? 'finished' : 'started'} <em><Link to={`/book/${book.id}`}>{book.title}</Link></em>
          </p>
          <p {...css({margin: '0'})}>
            {distanceInWordsToNow(created_at)} ago
          </p>
        </div>
        <div {...css({display: 'flex'})}>
          <div {...css({
            flex: '1',
            '@media(max-width: 500px)': {
              display: 'none',
            },
          })}>
            <BookImage bookData={book} />
          </div>
          <div {...css({
            padding: '20px',
            flex: '2',
          })}>
            <h1 {...css({marginTop: '0'})}>
              <Link to={`/book/${book.id}`}>{book.title}</Link>
            </h1>
            <h2 {...css({marginTop: '0'})}>{book.author}</h2>
            <p>{fadeString(book.description, 150)}</p>

            {bookReviews && <ReviewList reviews={bookReviews} />}
          </div>
        </div>
      </div>
    );
  }
}
