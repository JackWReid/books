import React from 'react';

import { SingleRowForm, WideInput, SubmitLink } from './styles';

const Form = SingleRowForm.extend`
  grid-area: middle;
`;

export default ({
  query = '',
  onChange = () => null,
  onSubmit = () => null
}) => (
  <Form onChange={onChange} onSubmit={onSubmit}>
    <WideInput
      value={query}
      autocapitalize="none"
      placeholder="Search Books by title or author"
    />
    <SubmitLink type="submit" value="Search" />
  </Form>
);
