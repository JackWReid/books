import React, { Component } from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';
import { FollowButton } from '../../components/ActionButtons';

class ProfileHeader extends Component {
  render() {
    const { user, userMeta } = this.props;

    return (
      <div {...css({
        padding: '20px',
        textAlign: 'center',
        background: '#FFEFE6',
      })}>
        <h1 {...css({
          margin: '0',
          fontFamily: 'Inconsolata',
        })}>
          {user.first_name} {user.last_name}
        </h1>
        <h2 {...css({
          fontSize: '16px',
          fontWeight: 'normal',
        })}>
          <Link to={`/user/${user.username}`}>
            @{user.username}
          </Link>
        </h2>
        <div {...css({
          display: 'block',
          margin: '10px auto',
        })}>
          <FollowButton user={user} userMeta={userMeta} />
        </div>
        <Link to={`/user/${user.id}/followers`} {...css({marginRight: '10px'})}>{user.followers} Followers</Link>
        <Link to={`/user/${user.id}/following`}>{user.following} Following</Link>
      </div>
    );
  }
}

export default ProfileHeader;
