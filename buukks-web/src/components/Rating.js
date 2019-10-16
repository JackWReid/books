import React from 'react';
import { css } from 'glamor';

const StarIcon = ({lit = false}) => {
  return (
    <svg width="22px" height="20px" viewBox="0 0 80 76">
      <defs />
      <g id="page" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <polygon id="star" fill={lit ? '#f9ec00' : '#eee'} points="15.3 76 40 58.1 64.7 76 55.3 47 80 29 49.4 29 40 0 30.6 29 0 29 24.7 47" />
      </g>
    </svg>
  );
};

const Rating = ({rating}) => {
  const roundedToHalfRating = Math.round((rating * 2) / 2);

  const arr = [];
  for (let iterator = 0; iterator < 5; iterator++) {
    iterator + 1 <= roundedToHalfRating
      ? arr.push(<StarIcon key={iterator} lit />)
      : arr.push(<StarIcon key={iterator} />);
  }

  return (
    <div {...css({display: 'flex', alignItems: 'center', justifyContent: 'flex-start'})}>
      {arr}
    </div>
  );
};

export default Rating;
