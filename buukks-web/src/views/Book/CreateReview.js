import React, { Component } from 'react';
import { css } from 'glamor';
import { createReviewForBook } from '../../services';
import { Button, Rating } from '../../components';
import { TextArea, SubmitButton, Range } from '../../components/Form';

export default class CreateReview extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      writingMode: false,
      rating: 3,
      review: null,
    };
  }

  formChange = (event) => {
    event.preventDefault();
    this.setState({[event.target.name]: event.target.value});
  }

  saveReview = (event) => {
    event.preventDefault();
    const { bookData } = this.props;
    const { rating, review } = this.state;
    createReviewForBook({
      book: bookData.id,
      review: {
        rating,
        review,
      },
      errorHandler: error => {
        console.error(error);
        this.setState({loading: false});
      },
      callback: () => window.location.reload(),
    })
  }

  render() {
    const { writingMode, rating } = this.state;

    if (!writingMode) {
      return (
        <div>
          <Button onClick={() => this.setState({writingMode: true})}>
            Review This Book
          </Button>
        </div>
      );
    }

    return (
      <div>
        <form onChange={this.formChange} onSubmit={this.saveReview}>
          <div {...css({
            display: 'flex',
            margin: '10px 0',
          })}>
            <Range {...css({marginRight: '10px'})} name="rating" />
            <Rating rating={rating} />
          </div>
          <TextArea name="review" placeholder="What do you think, huh?" />
          <SubmitButton>Save Review</SubmitButton>
        </form>
      </div>
    );
  }
}
