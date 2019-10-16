import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import request from 'axios';

import { SmallLink, LinkyButton, Container } from '../styles';

import BookList from '../BookList';
import Loading from '../Loading';

const Header = styled.header`
  max-width: 60rem;
  margin: 1em auto 0;
  padding: 0 1rem;
`;

const Title = styled.h1`
  margin-top: 0;
`;

const ToggleButton = LinkyButton.extend`
  margin-bottom: 2rem;
  font-weight: bold;
`;

const SubCategoryGrid = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-flow: row;
  grid-gap: 0.8rem;
  max-height: 20rem;
  margin: 0;
  padding: 0;
  font-size: 0.8rem;
  list-style: none;
  overflow-y: scroll;
`;

export default class SubCategoryPage extends Component {
  state = {
    categoryInfo: null,
    subCategoriesVisible: false,
    page: 'loading'
  };

  async fetchData() {
    try {
      const { data } = await request(
        `https://api.jackreid.xyz/category/${this.props.match.params.id}`
      );
      this.setState({ categoryInfo: data, page: 'ready' });
    } catch (error) {
      this.setState({ error, page: 'error' });
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  render() {
    if (this.state.page === 'loading') {
      return <Loading />;
    }

    const { description, books, subCategories } = this.state.categoryInfo;

    return (
      <Fragment>
        <Header>
          <Title>{description}</Title>
        </Header>

        <Container>
          <ToggleButton
            onClick={() =>
              this.setState({
                subCategoriesVisible: !this.state.subCategoriesVisible
              })
            }
          >
            View Subcategories
          </ToggleButton>
          {this.state.subCategoriesVisible && (
            <SubCategoryGrid>
              {subCategories.map(({ id, description }, i) => (
                <li key={i}>
                  <SmallLink to={`/subcategory/${id}`}>{description}</SmallLink>
                </li>
              ))}
            </SubCategoryGrid>
          )}
        </Container>

        <BookList books={books} />
      </Fragment>
    );
  }
}
