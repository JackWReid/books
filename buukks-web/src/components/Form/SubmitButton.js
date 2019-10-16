import React from 'react';
import { css } from 'glamor';

const SubmitButton = ({children, disabled, loading, ...props}) => (
  <input
    type="submit"
    value={loading ? "Loading" : children}
    {...css({
      WebkitAppearance: 'none',
      padding: '5px 10px',
      fontSize: '100%',
      fontFamily: 'Open Sans, Helvetica, sans-serif',
      color: 'white',
      backgroundColor: '#EF4339',
      border: 'none',
      borderRadius: '5px',
      cursor: loading ? 'wait' : 'pointer',
      opacity: disabled ? '0.5' : '1',
      ':hover': {
        backgroundColor: '#ce382f',
      },
    })}
    {...props} />
);

export default SubmitButton;
