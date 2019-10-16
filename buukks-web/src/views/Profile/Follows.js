import React, { Component } from 'react';
import { css } from 'glamor';
import { getUser, getUserFollowers, getUserFollowing } from '../../services';
import { LoadingPanel, UserList, BoundingColumn } from '../../components';

class Follows extends Component {
  constructor() {
    super();
    this.state = {
      userRelations: null,
      userData: null,
      loading: true,
    };
  }

  componentDidMount = () => {
    this.loadRelations();
    this.loadUser();
  }

  loadUser = () => {
    const { params } = this.props;
    this.setState({loading: true});
    getUser({
      user: params.id,
      errorHandler: error => console.error(error),
      callback: response => this.setState({userData: response.user, loading: false}),
    });
  }

  loadRelations = () => {
    const { relation, params } = this.props;
    if (relation === 'followers') {
      getUserFollowers({
        user: params.id,
        errorHandler: error => console.error(error),
        callback: userRelations => this.setState({userRelations, loading: false}),
      });
    } else if (relation === 'following') {
      getUserFollowing({
        user: params.id,
        errorHandler: error => console.error(error),
        callback: userRelations => this.setState({userRelations, loading: false}),
      });
    }
  }

  render() {
    const { relation } = this.props;
    const { loading, userData, userRelations } = this.state;

    if (loading)
      return <LoadingPanel />;

    return (
      <div {...css({
        width: '100%',
      })}>
        {userData && <div {...css({
          width: '100%',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#FFEFE6',
        })}>
          <BoundingColumn>
            <h1>{userData.first_name}'s {relation === 'following' ? 'Following' : 'Followers'}</h1>
          </BoundingColumn>
        </div>}
        <BoundingColumn>
          <UserList users={userRelations} />
        </BoundingColumn>
      </div>
    );
  }
}

const giveFollowersProp = ComposedComponent => (
  class extends Component {
    render() {
      return (
        <ComposedComponent {...this.props} relation="followers" />
      );
    }
  }
);

const giveFollowingProp = ComposedComponent => (
  class extends Component {
    render() {
      return (
        <ComposedComponent {...this.props} relation="following" />
      );
    }
  }
);

const ProfileFollowing = giveFollowingProp(Follows);
const ProfileFollowers = giveFollowersProp(Follows);

export {
  ProfileFollowing,
  ProfileFollowers,
}
