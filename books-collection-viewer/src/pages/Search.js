import React, { Component } from 'react';
import styled from 'styled-components';
import qs from 'qs';

import { searchBooks } from '../service';
import BookList from '../BookList';
import Loading from '../Loading';

const ResultsInfo = styled.div`
  width: 100%;
  padding: 0.5rem;
  text-align: center;
  font-weight: bold;
  background-color: #f4f4f4;
`;

export default class SearchPage extends Component {
  state = {
    state: 'LOADING',
    results: null,
    books: []
  };

  async updateBooks(params) {
    const books = await searchBooks({ query: params['?q'] });
    this.setState({ state: 'READY', books, results: books.length });
  }

  componentDidMount() {
    this.updateBooks(qs.parse(window.location.search));
  }

  render() {
    return (
      this.state.state === 'READY' ?
      <div>
        <ResultsInfo>{this.state.results} books found</ResultsInfo>
        <BookList books={this.state.books} />
      </div> :
      <Loading />
    );
  }
}
