import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import qs from 'querystring';

import SearchBox from './SearchBox';

import SearchPage from './pages/Search';
import BookPage from './pages/Book';
import CategoryPage from './pages/Category';
import AddPage from './pages/Add';
import LandingPage from './pages/LandingPage';

const Container = styled.div`
  margin: 0 auto;
`;

const TopBar = styled.div`
  position: sticky;
  top: 0;
  display: grid;
  grid-template-columns: 1fr 60rem 1fr;
  grid-template-areas: 'left middle right';
  width: 100%;
  background-color: white;

  @media (max-width: 900px) {
    display: block;
  }
`;

const TitleBlock = styled.h1`
  grid-area: left;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  font-size: 1.5rem;

  @media (max-width: 600px) {
    text-align: center;
  }
`;

const PlainLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

export default class DefaultView extends Component {
  state = {
    q: ''
  };

  updateQuery = event => {
    this.setState({ q: event.target.value });
  };

  searchSubmit = event => {
    event.preventDefault();
    window.location = `/search?q=${this.state.q}`;
  };

  componentDidMount() {
    const route = window.location.pathname.split('/');
    if (route[1] === 'search') {
      return this.setState({ q: qs.parse(window.location.search)['?q'] });
    } else {
      return this.setState({ q: '' });
    }
  }

  render() {
    return (
      <Container>
        <TopBar>
          <TitleBlock>
            <PlainLink to="/">Book Collection</PlainLink>
          </TitleBlock>
          <SearchBox
            query={this.state.q}
            onChange={this.updateQuery}
            onSubmit={this.searchSubmit}
          />
        </TopBar>

        <Route path="/search" component={SearchPage} />
        <Route path="/book/:id" component={BookPage} />
        <Route path="/category/:id" component={CategoryPage} />
        <Route path="/add" component={AddPage} />
        <Route exact={true} path="/" component={LandingPage} />
      </Container>
    );
  }
}
