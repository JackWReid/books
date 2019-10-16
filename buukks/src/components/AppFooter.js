import React from 'react';
import { Link } from 'react-router';
import { style } from 'glamor';

const AppFooter = () => {
  return (
    <div {...style({
      position: 'fixed',
      bottom: '0',
      zIndex: '20',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      width: '100%',
      backgroundColor: '#FFEFE6',
    })}>
      <Link to="/about">About</Link>
    </div>
  );
}

export default AppFooter;
