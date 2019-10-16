import React from 'react';
import Textarea from 'react-textarea-autosize';
import { css } from 'glamor';

const TextArea = ({...props}) => (
  <Textarea
    {...css({
      width: '100%',
      marginTop: '10px',
      padding: '10px',
      WebkitAppearance: 'none',
      lineHeight: '1.3',
      border: '2px solid #eee',
      fontFamily: 'Open Sans, Helvetica, sans-serif',
      fontSize: '100%',
      borderRadius: '5px',
      transition: 'border .3s ease-in-out',
      ':focus': {
        border: '2px solid #EF4339',
        outline: 'none',
      },
    })}
    {...props} />
);

export default TextArea;
