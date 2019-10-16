import React, { Component } from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';
import { uniqueBy } from '../../utils';
import { getUserFinishedBooks } from '../../services';
import { LoadingPanel } from '../../components';
import { BookGrid } from '../../components/BookList';

export default class UserFinished extends Component {
  constructor() {
    super();
    this.state = {
      userFinishedBooks: null,
      loading: true,
    };
  }

  componentDidMount = () => this.loadUserFinishedBooks();

  loadUserFinishedBooks = () => {
    getUserFinishedBooks({
      user: this.props.user.id,
      limit: 8,
      errorHandler: error => console.error(error),
      callback: userFinishedBooks => this.setState({
        userFinishedBooks: uniqueBy(userFinishedBooks, item => item.id),
        loading: false
      }),
    });
  }

  render() {
    const { user } = this.props;
    const { loading, userFinishedBooks } = this.state;

    if (loading)
      return <LoadingPanel />

    if (userFinishedBooks.length === 0)
      return null;

    return (
      <div {...css({padding: '10px'})}>
        <h1
          {...css({
            margin: '16px 0',
            fontSize: '24px',
          })}>
          <Link to={`/user/${user.username}/finished`}>Finished Books</Link>
        </h1>
        <BookGrid books={userFinishedBooks} />
      </div>
    );
  }
}
