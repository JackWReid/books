import React from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';
import { currentUser, logout } from '../../auth';

const linkStyle = {
  marginLeft: '10px',
  cursor: 'pointer',
};

const DesktopNavigationLinks = () => (
  <div {...css({
    '@media(max-width: 599px)': {
      display: 'none',
    },
  })}>
    {currentUser() && <Link {...css(linkStyle)} onClick={close} to={`/user/${currentUser().id}`}>
      Profile
    </Link>}
    {!currentUser() && <Link {...css(linkStyle)} onClick={close} to="/login">
      Login
    </Link>}
    <Link {...css(linkStyle)} onClick={close} to="/search">Search</Link>
    {currentUser() && <Link {...css(linkStyle)} onClick={() => { logout(); return close(); }}>
      Logout
    </Link>}
  </div>
);

export default DesktopNavigationLinks;
