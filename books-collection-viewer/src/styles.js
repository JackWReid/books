import { Link } from 'react-router-dom';
import styled from 'styled-components';

/**
 * LAYOUT
 */
export const Container = styled.article`
  margin: 0 auto;
  max-width: 60rem;
  width: 100%;
  padding: 1rem;
`;

/**
 * TEXT
 */
export const PlainList = styled.ul`
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const SpreadItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SmallLink = styled(Link)`
  text-decoration: underline;
  color: inherit;
`;

/**
 * FORMS
 */
export const LinkyButton = styled.button`
  padding: 0;
  font-size: 1rem;
  background: none;
  border: none;
  appearance: none;
  text-decoration: underline;
  cursor: pointer;
`;

export const SingleRowForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1rem 0;

  @media (max-width: 900px) {
    padding: 1rem;
  }
`;

export const WideInput = styled.input`
  flex-grow: 1;
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  appearance: none;
  font-size: 1rem;
  border: none;
  border: 1px solid #f4f4f4;
`;

export const SubmitLink = styled.input`
  font-size: 1rem;
  appearance: none;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
`;
