import React from 'react';
import { Link } from 'react-router';
import { distanceInWordsToNow } from 'date-fns';
import { css } from 'glamor';
import { FollowButton } from './ActionButtons';

const UserListItem = ({user}) => (
  <li {...css({marginBottom: '30px'})}>
    <h1 {...css({fontSize: '24px'})}>
      <Link to={`/user/${user.id}`} {...css({textDecoration: 'none'})}>
        {user.first_name} {user.last_name}
      </Link>
    </h1>
    <h2 {...css({fontSize: '16px'})}>
      <Link to={`/user/${user.id}`} {...css({textDecoration: 'none'})}>
        @{user.username}
      </Link>
    </h2>
    <p>Joined {distanceInWordsToNow(user.created_at)} ago</p>
    <FollowButton user={user} />
  </li>
);

const UserList = ({users}) => {
  if (!users)
    return null;

  return (
    <ul {...css({
      listStyle: 'none',
      margin: '0',
      padding: '10px',
    })}>
      {users.map((user, index) => <UserListItem user={user} key={index} />)}
    </ul>
  );
}

export default UserList;
