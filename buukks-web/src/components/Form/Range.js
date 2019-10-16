import React from 'react';

const Range = ({min = 0, max = 5, step = 1, ...props}) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    {...props}
  />
);

export default Range;
