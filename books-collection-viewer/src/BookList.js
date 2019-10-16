import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: center;

  &:nth-child(2n) {
    background: #f4f4f4;
  }
`;

const Retainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 1rem;
  max-width: 60rem;
  color: inherit;
  text-decoration: none;
`;

const SmallLink = styled(Link)`
  color: inherit;
`;

const BookTitle = styled.h1`
  font-size: 1rem;
`;

const BookAuthor = styled.h2`
  max-width: 10em;
  font-size: 1rem;
  font-weight: normal;
  text-align: right;
`;

export default ({ books = [] }) => (
  <List>
    {books.map(({ title, author, id, dewey }) => (
      <ListItem key={id}>
        <Retainer to={`/book/${id}`}>
          <BookTitle>
            <SmallLink to={`/book/${id}`}>{title}</SmallLink>
          </BookTitle>
          <BookAuthor>{author}</BookAuthor>
          {/* <p>{dewey.description}</p> */}
        </Retainer>
      </ListItem>
    ))}
  </List>
);
