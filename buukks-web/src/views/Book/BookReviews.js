import React, { Component } from 'react';
import { css } from 'glamor';
import { currentUser } from '../../auth';
import { getReviewsForBook } from '../../services';
import { LoadingPanel, ReviewList, BoundingColumn } from '../../components';
import CreateReview from './CreateReview';

export default class BookReviews extends Component {
  constructor() {
    super();
    this.state = {
      reviews: null,
      loading: true,
    };
  }

  componentDidMount() {
    const { bookData } = this.props;
    getReviewsForBook({
      book: bookData.id,
      errorHandler: () => {
        this.setState({loading: false});
      },
      callback: response => this.setState({loading: false, reviews: response}),
    });
  }

  render() {
    const { bookMeta, bookData } = this.props;
    const { loading, reviews } = this.state;

    if (loading)
      return <LoadingPanel />;

    return (
      <div>
        <BoundingColumn>
          <div {...css({
            padding: '0 20px',
          })}>
            <h2>Reviews</h2>
            {reviews && <ReviewList reviews={reviews} />}
            {currentUser() && !bookMeta.hasReviewed && <CreateReview bookData={bookData} />}
          </div>
        </BoundingColumn>
      </div>
    );
  }
}
