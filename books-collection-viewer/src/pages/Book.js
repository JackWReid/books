import React, { Component } from 'react';
import styled from 'styled-components';

import { getBookById } from '../service';
import Loading from '../Loading';

import { Container } from '../styles';

const Flex = styled.div`
  display: flex;

  @media (max-width: 800px) {
    display: block;
  }
`;

const InfoColumn = styled.div`
  @media (min-width: 800px) {
    margin-left: 2rem;
  }
`;

const CoverImage = styled.img`
  display: block;
  width: 100%;

  @media (min-width: 800px) {
    width: 30%;
  }
`;

const BookTitle = styled.h1`
  font-size: 2.5rem;

  @media (min-width: 800px) {
    margin-top: 0;
  }
`;

export default class BookPage extends Component {
  state = {
    book: null,
    page: 'loading'
  };

  async fetchBookData() {
    try {
      const book = await getBookById(this.props.match.params.id);
      this.setState({ book, page: 'ready' });
    } catch (error) {
      console.log(error);
      this.setState({ page: 'error', error });
    }
  }

  componentWillMount() {
    this.fetchBookData();
  }

  render() {
    if (this.state.page === 'loading') {
      return <Loading />;
    }

    const { title, author, cover, category, description } = this.state.book;
    return (
      <Container>
      <Flex>
      {cover && <CoverImage src={cover} alt={title} />}
      <InfoColumn>
      <BookTitle>{title}</BookTitle>
      {author && <h2>by {author}</h2>}
      {category && <h3>{category}</h3>}
      {description && <p>{description}</p>}
      </InfoColumn>
      </Flex>
      </Container>
    );
  }
}
