import React from 'react';
import { style } from 'glamor';

const ContentColumn = ({children}) => {
  return (
    <div {...style({maxWidth: '800px', margin: '0 auto', padding: '0 5vw'})}>
      {children}
    </div>
  )
}

export default ContentColumn;
