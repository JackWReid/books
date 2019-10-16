import React, { Component } from 'react';
import { css } from 'glamor';
import { currentUser } from '../../auth';
import { getReadingForUser, finishBook } from '../../services';
import { FinishReadingButton } from '../../components/ActionButtons';
import { BookList } from '../../components/BookList';

export default class CurrentlyReading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readingData: null,
      loading: false,
    };
  }

  componentWillMount = () => this.getReading();

  handleError = error => {
    this.setState({
      loading: false,
    });
  }

  handleResults = user => {
    this.setState({
      readingData: user.id ? user : null,
      loading: false,
    });
  }

  getReading = () => {
    return getReadingForUser({
      user: this.props.user.id,
      callback: this.handleResults,
      errorHandler: this.handleError,
    });
  }

  finishBook = () => {
    return finishBook({
      errorHandler: error => console.error(error),
      callback: () => this.getReading(),
    });
  }

  render() {
    const { user } = this.props;
    const { readingData, loading } = this.state;

    const isMyReading = currentUser().id === user.id;

    if (loading)
      return <div>Loading...</div>

    if (!readingData)
      return null;

    return (
      <div>
        <h1
          {...css({
            margin: '16px 0 0 10px',
            fontSize: '24px',
          })}>
          Currently Reading
        </h1>
        <BookList books={[readingData]} ActionButton={isMyReading ? FinishReadingButton : undefined} />
      </div>
    );
  }
}
