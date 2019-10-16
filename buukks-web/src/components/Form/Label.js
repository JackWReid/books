import React from 'react';
import { css } from 'glamor';

const Label = ({children, ...props}) => (
  <label
    {...css({
      display: 'block',
      margin: '20px 0 5px',
      fontFamily: 'Open Sans, Helvetica, sans-serif',
    })}
    {...props}>
      {children}
    </label>
);

export default Label;
