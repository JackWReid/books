import React, { Component } from 'react';
import { css } from 'glamor';
import { searchBooks } from '../services';
import { TextInput } from './Form';
import { BookList } from './BookList/';

export default class EmbeddedSearch extends Component {
  constructor() {
    super();
    this.state = {
      query: '',
      loading: false,
      searchResults: null,
    };
  }

  submitForm = e => {
    e.preventDefault();
    const { query } = this.state;
    if (query && query.length > 0) {
      this.setState({
        searchResults: null,
        loading: true,
      });
      searchBooks({
        query: query,
        callback: this.handleResults,
        errorHandler: this.handleError,
      });
    }
  };

  handleResults = results => {
    this.setState({
      loading: false,
      searchResults: results,
    });
  };

  render() {
    const { query, searchResults } = this.state;
    const { ActionButton } = this.props;

    return (
      <div {...css({width: '100%'})}>
        <form {...css({width: '100%'})} onSubmit={this.submitForm}>
          <TextInput
            placeholder="Search for books"
            value={query}
            onChange={e => this.setState({query: e.target.value})} />
        </form>
        { searchResults && <BookList books={searchResults} ActionButton={ActionButton} compact /> }
      </div>
    );
  }
}
