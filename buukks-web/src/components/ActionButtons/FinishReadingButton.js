import React, { Component } from 'react';
import { currentUser } from '../../auth';
import { finishBook } from '../../services';
import Button from '../Button';

export default class FinishReadingButton extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }

  finishBook = () => {
    const { refreshParent, book, muted } = this.props;
    this.setState({loading: true});

    finishBook({
      book,
      muted,
      errorHandler: error => console.error(error),
      callback: () => {
        this.setState(oldState => {
          return {
            bookMeta: {
              isReading: false,
              hasFinished: true,
            },
            loading: false,
          }
        });
        if (refreshParent) {
          refreshParent();
        } else {
          window.location.reload();
        }
      },
    });
  }

  render() {
    const { muted, bookMeta } = this.props;
    const { loading } = this.state;

    if (!currentUser())
      return null;

    if (!bookMeta)
      return null;

    return (
      <Button loading={loading} onClick={this.finishBook} {...this.props}>{muted ? 'Finished It' : 'Finish'}</Button>
    );
  }
}
