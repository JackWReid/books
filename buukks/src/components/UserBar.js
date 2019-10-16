import React from 'react';
import { style } from 'glamor';
import { ctaButton } from '../styles/buttons';

const UserIdent = ({image, name}) => {
  return <div {...style({display: 'flex', alignItems: 'center', marginLeft: '10px'})}>
    <img alt={name} {...style({display: 'block', maxWidth: '25px', borderRadius: '50%'})} src={image} />
    <p {...style({margin: '0 0 0 .5em'})}>{name}</p>
  </div>
}

const UserBar = ({user, logout}) => {
  return <div {...style({
      display: 'flex',
      width: '100%',
      marginBottom: '20px',
      padding: '10px',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'hsl(0,10%,95%)'
    })}>
    <UserIdent image={user.photoURL} name={user.displayName} />
    <button {...style(ctaButton)} onClick={logout}>Logout</button>
  </div>
}

export default UserBar;
