import React from 'react';
import { Link } from 'react-router';
import { style } from 'glamor';
import { ctaButton } from '../../styles/buttons';

const PrimaryButton = ({action, link, children}) => {
  if (link) {
    return <Link to={link} {...style(ctaButton)}>
      {children}
    </Link>;
  }

  else if (action === "submit") {
    return <input type="submit" {...style(ctaButton)} value={children} />
  }

  return <button onClick={action} {...style(ctaButton)}>
    {children}
  </button>;
}

export default PrimaryButton;
