import React from 'react';
import { css } from 'glamor';

const BoundingColumn = ({children}) => (
  <div {...css({
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    flex: '1',
  })}>
    {children}
  </div>
);

export default BoundingColumn;
