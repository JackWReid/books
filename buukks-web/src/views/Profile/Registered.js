import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { css } from 'glamor';
import { getUser, getUserRegisteredBooks } from '../../services';
import { BoundingColumn, LoadingPanel, Button } from '../../components';
import { BookList } from '../../components/BookList';

export default class Registered extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      userData: null,
      userRegisteredBooks: [],
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
        getUserRegisteredBooks({
          user: results.user.id,
          limit: 10,
          offset: newPageLength || pageLength - 10,
          errorHandler: error => console.error(error),
          callback: response => {
            this.setState({loading: false, userRegisteredBooks: this.state.userRegisteredBooks.concat(response)})
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
    const { loading, userData, userRegisteredBooks } = this.state;

    if (loading && userRegisteredBooks.length === 0)
      return <LoadingPanel />;

    return (
      <div {...css({
        width: '100%',
      })}>
        <Helmet title={`${userData.first_name} ${userData.last_name}'s Registered Books'`} />
        {userData && <div {...css({
          width: '100%',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#FFEFE6',
        })}>
          <BoundingColumn>
            <h1>Registered Books</h1>
            <p>Back to <Link to={`/user/${userData.username}`}>{userData.first_name} {userData.last_name}</Link></p>
          </BoundingColumn>
        </div>}
        <BoundingColumn>
          <BookList books={userRegisteredBooks} />
        </BoundingColumn>
        {userRegisteredBooks.length % 10 === 0 && <div {...css({
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
