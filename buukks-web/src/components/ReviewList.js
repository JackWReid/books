import React from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';
import Rating from './Rating';

const ReviewListItem = ({reviewData}) => {
  return (
    <li>
      <p {...css({marginBottom: '10px'})}>
        <Link to={`/user/${reviewData.user.username}`}>
          {reviewData.user.first_name} {reviewData.user.last_name}
        </Link> wrote
      </p>
      <Rating rating={reviewData.review.rating} />
      <p>{reviewData.review.review}</p>
    </li>
  );
}

const ReviewList = ({reviews}) => (
  <ul {...css({
    margin: '0',
    padding: '0',
    listStyle: 'none',
  })}>
    {reviews.map((review, i) => <ReviewListItem key={i} reviewData={review} />)}
  </ul>
);

export default ReviewList;
