import React from 'react';
import { css } from 'glamor';

const colourThrob = css.keyframes('colourThrob', {
  '0%': { backgroundColor: '#FFF' },
  '50%': { backgroundColor: '#FFEFE6' },
  '100%': { backgroundColor: '#FFF' },
});

const LoadingPanel = () => (
  <div {...css({
    width: '100%',
    height: '100%',
    padding: '10px',
    textAlign: 'center',
    background: 'white',
    animation: `${colourThrob} 1s infinite`,
  })}>
    <p>Loading...</p>
  </div>
);

export default LoadingPanel;
