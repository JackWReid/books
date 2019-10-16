import React, { Component } from 'react';
import { css } from 'glamor';
import { searchGoogleBooks } from '../../services';
import { RegisterBookButton } from '../../components/ActionButtons';
import { LoadingPanel, BoundingColumn } from '../../components';
import { BookList } from '../../components/BookList';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null,
      loadingResults: false,
      searchError: null,
    }
  }

  componentWillMount = () => this.startSearch();

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

  startSearch = () => {
    const { query } = this.props;
    const { loadingResults } = this.state;
    if (query.length > 0 && !loadingResults) {
      this.setState({loadingResults: true});
      searchGoogleBooks({
        query,
        callback: this.handleResults,
        errorHandler: this.handleError,
      });
    }
  }

  render() {
    const { searchResults, loadingResults } = this.state;

    if (loadingResults) { return <LoadingPanel /> }

    return (
      <div {...css({width: '100%'})}>
        <BoundingColumn>
          <h1>Register a new book</h1>
          <BookList loading={loadingResults} books={searchResults} useShallow ActionButton={RegisterBookButton} />
        </BoundingColumn>
    </div>
    );
  }
}
