import React from 'react';
import { Link } from 'react-router';
import { style } from 'glamor';

import { PrimaryButton } from './buttons';

const AppHeader = ({user, logout}) => {
  return (
    <div {...style({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      backgroundColor: '#FFDBC5',
    })}>
      <h1 {...style({
        margin: '0',
        padding: '10px',
        fontSize: '1.5rem',
        fontFamily: 'Maison Neue, sans-serif',
      })}>
        <Link {...style({textDecoration: 'none', color: 'inherit'})} to="/">Buukks</Link>
      </h1>

      { user &&
        <div>
          <PrimaryButton link="/dashboard">Dashboard</PrimaryButton>
          <PrimaryButton action={logout}>Leave</PrimaryButton>
        </div>
      }
    </div>
  );
}

export default AppHeader;
