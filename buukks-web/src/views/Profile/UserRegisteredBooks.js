import React, { Component } from 'react';
import { Link } from 'react-router';
import { BookGrid } from '../../components/BookList';
import { getUserRegisteredBooks } from '../../services';
import { css } from 'glamor';

export default class UserRegisteredBooks extends Component {
  constructor() {
    super();
    this.state = {
      bookList: [],
      loading: true,
    };
  }

  componentDidMount = () => this.loadBookData();

  loadBookData = () => {
    const { user } = this.props;
    getUserRegisteredBooks({
      user: user.id,
      limit: 8,
      callback: results => this.handleResults(results),
      errorHandler: error => this.handleError(error),
    });
  }

  handleResults = results => {
    this.setState({
      bookList: results,
      loading: false,
    });
  }

  handleError = error => {
    this.setState({
      bookList: [],
      loading: false,
    });
  }

  render() {
    const { user } = this.props;
    const { loading, bookList } = this.state;

    if (loading)
      return <div>Loading...</div>;

    if (bookList.length === 0)
      return null;

    return (
      <div {...css({padding: '10px'})}>
        <h1
          {...css({
            margin: '16px 0',
            fontSize: '24px',
          })}>
          <Link to={`/user/${user.username}/registered`}>Registered Books</Link>
        </h1>
        <BookGrid books={bookList} />
      </div>
    );
  }
}
