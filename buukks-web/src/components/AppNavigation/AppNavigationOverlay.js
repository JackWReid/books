import React from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';
import { currentUser, logout } from '../../auth';
import Button from '../Button';

const linkStyle = {
  display: 'block',
  marginBottom: '16px',
  fontSize: '24px',
  textDecoration: 'none',
};

const drawerFromRight = css.keyframes('drawerFromRight', {
  '0%': { transform: 'translateX(100vw)' },
  '100%': { transform: 'translateX(0)' },
});

const AppNavigationOverlay = ({close}) => (
  <div {...css({
    position: 'fixed',
    height: '100vh',
    width: '100vw',
    background: '#FFEFE6',
    top: '0',
    left: '0',
    right: '0',
    zIndex: '10',
    animation: `${drawerFromRight} .3s`,
    cursor: 'pointer'
  })}>
    <nav {...css({
      padding: '10px',
    })}>
      <Button
        onClick={close}
        {...css({
          position: 'absolute',
          top: '10px',
          right: '10px',
        })}>
        Close
      </Button>
      {currentUser() && <Link style={linkStyle} onClick={close} to={`/user/${currentUser().id}`}>Profile</Link>}
      {!currentUser() && <Link style={linkStyle} onClick={close} to="/login">Login</Link>}
      <Link style={linkStyle} onClick={close} to="/search">Search</Link>
      {currentUser() && <Link style={linkStyle} onClick={() => { logout(); return close(); }}>Logout</Link>}
    </nav>
  </div>
);

export default AppNavigationOverlay;
