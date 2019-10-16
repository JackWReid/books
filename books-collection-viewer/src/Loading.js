import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default () => (
  <Container>
    <h1>Loading</h1>
  </Container>
);
