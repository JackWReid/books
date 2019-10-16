import React from 'react';
import { style } from 'glamor';

const PageHeader = ({children}) => {
  return (
    <h1 {...style({
      margin: '0',
      padding: '20px 10px',
      fontSize: '20px',
      textAlign: 'center',
      fontFamily: 'Maison Neue, sans-serif',
      backgroundColor: '#FFEFE6',
    })}>
      {children}
    </h1>
  );
}

export default PageHeader;
