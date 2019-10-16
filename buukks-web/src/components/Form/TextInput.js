import React from 'react';
import { css } from 'glamor';

const TextInput = ({doValidate, disabled = false, ...props}) => (
  <input
    disabled={disabled}
    {...props}
    {...css({
    width: '100%',
    padding: '10px',
    WebkitAppearance: 'none',
    border: '2px solid #eee',
    fontFamily: 'Open Sans, Helvetica, sans-serif',
    fontSize: '100%',
    borderRadius: '5px',
    transition: 'border .3s ease-in-out',
    cursor: disabled ? 'notallowed' : 'inherit',
    ':focus': {
      border: '2px solid #EF4339',
      outline: 'none',
    },
    ':invalid': {
      backgroundColor: doValidate ? 'rgba(255,0,0,0.1)' : 'white',
    },
    ':valid': {
      backgroundColor: doValidate ? 'rgba(0,255,0,0.1)' : 'white',
    }
  })} />
);

export default TextInput;
