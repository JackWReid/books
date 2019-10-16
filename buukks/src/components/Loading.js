import React from 'react';
import { style } from 'glamor';

const Loading = () => {
  return <div {...style({
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    width: '100vw',
    height: '100vh',
    background: '#FFEFE6',
  })}>
    <div {...style({
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100px',
      width: '100px',
      color: 'white',
      background: '#EF4339',
      borderRadius: '50%',
    })}>
      <p>Loading</p>
    </div>
  </div>
}

export default Loading;
