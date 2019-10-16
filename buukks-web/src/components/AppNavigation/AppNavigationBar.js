import React from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';
import Button from '../Button';
import DesktopNavigationLinks from './DesktopNavigationLinks';

const AppNavigationBar = ({open}) => (
  <div {...css({
    width: '100vw',
    height: '50px',
    position: 'fixed',
    top: '0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    fontFamily: 'Inconsolata',
    background: '#FFDBC5',
    zIndex: '5',
  })}>
    <p {...css({
      margin: '0',
      fontSize: '1.5em',
    })}>
      <Link to="/">Buukks</Link>
    </p>
    <DesktopNavigationLinks />
    <Button
      onClick={open}
      {...css({
        '@media(min-width: 600px)': {
          display: 'none',
        }
      })}>
      Menu
    </Button>
  </div>
);

export default AppNavigationBar;
