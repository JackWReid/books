import React, { Component } from 'react';
import { currentUser } from '../../auth';
import { startBook } from '../../services';
import Button from '../Button';

export default class StartReadingButton extends Component {
  constructor() {
    super();
    this.state = {loading: false};
  }

  startBook = () => {
    const { book } = this.props;
    this.setState({loading: true});

    startBook({
      book,
      errorHandler: error => console.error(error),
      callback: () => window.location.reload(),
    });
  }

  render() {
    const { bookMeta } = this.props;
    const { loading } = this.state;

    if (!currentUser())
      return null;

    if (!bookMeta)
      return null;

    if (bookMeta.isReading)
      return null;

    return (
      <Button loading={loading} onClick={this.startBook} {...this.props}>Start Reading</Button>
    );
  }
}
