import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { css } from 'glamor';
import { getUser, getUserFinishedBooks } from '../../services';
import { BoundingColumn, LoadingPanel, Button } from '../../components';
import { BookList } from '../../components/BookList';

export default class Finished extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      userData: null,
      userFinishedBooks: [],
      pageLength: 10,
    }
  }

  componentDidMount = () => this.getData();

  getData = (newPageLength) => {
    const { params } = this.props;
    const { pageLength } = this.state;
    getUser({
      user: params.id,
      errorHandler: error => console.error(error),
      callback: results => {
        this.setState({userData: results.user});
        getUserFinishedBooks({
          user: results.user.id,
          limit: 10,
          offset: newPageLength || pageLength - 10,
          errorHandler: error => console.error(error),
          callback: response => {
            this.setState({loading: false, userFinishedBooks: this.state.userFinishedBooks.concat(response)})
          },
        });
      },
    });
  }

  extendPageLength = () => {
    const { pageLength } = this.state;
    this.setState({pageLength: pageLength + 10, loading: true});
    this.getData(pageLength);
  }

  render() {
    const { loading, userData, userFinishedBooks } = this.state;

    if (loading && userFinishedBooks.length === 0)
      return <LoadingPanel />;

    return (
      <div {...css({
        width: '100%',
      })}>
        <Helmet title={`${userData.first_name} ${userData.last_name}'s Finished Books'`} />
        {userData && <div {...css({
          width: '100%',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#FFEFE6',
        })}>
          <BoundingColumn>
            <h1>Finished Books</h1>
            <p>Back to <Link to={`/user/${userData.username}`}>{userData.first_name} {userData.last_name}</Link></p>
          </BoundingColumn>
        </div>}
        <BoundingColumn>
          <BookList books={userFinishedBooks} />
        </BoundingColumn>
        {userFinishedBooks.length % 10 === 0 && <div {...css({
          width: '100%',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#FFEFE6',
        })}>
          <Button onClick={this.extendPageLength}>Load More</Button>
        </div>}
      </div>
    );
  }
}
