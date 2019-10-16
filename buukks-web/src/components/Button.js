import React from 'react';
import { css } from 'glamor';

const Button = ({children, loading, onClick, small, ...props}) => (
  <button
    {...css({
      WebkitAppearance: 'none',
      padding: small ? '3px 5px' : '5px 10px',
      fontSize: small ? '50%' : '100%',
      fontFamily: 'Open Sans, Helvetica, sans-serif',
      color: 'white',
      backgroundColor: '#EF4339',
      border: 'none',
      borderRadius: '5px',
      cursor: loading ? 'wait' : 'pointer',
      ':hover': {
        backgroundColor: '#ce382f',
      },
      ':active': {
        opacity: '0.8',
      },
      '> a': {
        color: 'inherit',
        textDecoration: 'none',
      }
    })}
    onClick={loading ? null : onClick}
    {...props}>
    {loading ? "Loading" : children}
  </button>
);

export default Button;
