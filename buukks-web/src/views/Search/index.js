import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { css } from 'glamor';
import { searchBooks, searchUsers } from '../../services';
import { UserList, BoundingColumn, LoadingPanel } from '../../components';
import { BookList } from '../../components/BookList';
import SearchBox from './SearchBox';
import RegisterSearch from './RegisterSearch';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingResults: false,
      searchResults: null,
      searchError: null,
    }
  }

  componentDidMount() {
    this.runSearch(this.props.location.query);
  }

  componentWillReceiveProps(nextProps) {
    this.runSearch(nextProps.location.query);
  }

  runSearch = ({q, type}) => {
    if (q && q.length > 0) {
      this.setState({
        searchResults: null,
      });

      if (type === 'user') {
        searchUsers({
          query: q,
          callback: this.handleResults,
          errorHandler: this.handleError,
        });
      }

      else {
        searchBooks({
          query: q,
          callback: this.handleResults,
          errorHandler: this.handleError,
        });
      }
    }
  }

  handleError = error => {
    this.setState({
      searchResults: null,
      searchError: error,
      loadingResults: false,
    });
  }

  handleResults = results => {
    this.setState({
      searchResults: results,
      loadingResults: false,
    })
  }

  render() {
    const { searchResults, loadingResults } = this.state;
    const { location: { query: { q, type } } } = this.props;

    return (
      <div {...css({width: '100%', display: 'flex', flexDirection: 'column'})}>
        <Helmet title="Search" />
        <SearchBox
          initialQuery={q}
          initialSearchType={type}
        />
        <BoundingColumn>
          {loadingResults && <LoadingPanel />}
          {!loadingResults && searchResults && searchResults.length > 0  && type === 'user' && <div {...css({flex: '1'})}><UserList users={searchResults} /></div>}
          {!loadingResults && searchResults && searchResults.length > 0  && type !== 'user' && <div {...css({flex: '1'})}><BookList books={searchResults} /></div>}
          {!loadingResults && searchResults && searchResults.length === 0 && <div {...css({
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px',
          })}>No Results in Buukks</div>}
          {!loadingResults && searchResults && type !== 'user' && searchResults.length < 10 && <RegisterSearch query={q} />}
        </BoundingColumn>
        {!loadingResults && searchResults && searchResults.length > 10 &&
        <div {...css({
          width: '100%',
          textAlign: 'center',
          padding: '10px',
          backgroundColor: '#FFEFE6',
        })}>
          <p>Don't see your book here? Be the first to introduce it to Buukks and <Link to="/register">Register</Link> it!</p>
        </div>}
      </div>
    );
  }
}
