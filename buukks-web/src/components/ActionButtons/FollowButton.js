import React, { Component } from 'react';
import { currentUser, cookieToken } from '../../auth';
import { getUser, followUser, unfollowUser } from '../../services';
import Button from '../Button';

export default class FollowButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserMeta: null,
      loading: true,
    };
  }

  componentWillMount = () => {
    if (currentUser() && !this.state.currentUserMeta) {
      this.loadData();
    }
  }

  loadData = () => {
    return getUser({
      user: this.props.user.id,
      errorHandler: error => console.error(error),
      callback: response => {
        this.setState({
          currentUserMeta: response.meta,
          loading: false,
        })
      },
    });
  }

  buttonHandler = event => {
    event.preventDefault();
    this.setState({loading: true});
    const { user } = this.props;
    const { currentUserMeta } = this.state;

    const alreadyFollows = !!currentUserMeta.isFollower;

    if (alreadyFollows) {
      return unfollowUser({
        user: user.id,
        token: cookieToken(),
        callback: () => this.setState(oldState => ({
          currentUserMeta: {
            isFollowee: oldState.currentUserMeta.isFollowee,
            isFollower: false,
          },
          loading: false,
        })),
        errorHandler: error => console.error(error),
      });
    } else {
      return followUser({
        user: user.id,
        token: cookieToken(),
        callback: () => this.setState(oldState => ({
          currentUserMeta: {
            isFollowee: oldState.currentUserMeta.isFollowee,
            isFollower: true,
          },
          loading: false,
        })),
        errorHandler: error => console.error(error),
      });
    }
  }

  render() {
    const { user } = this.props;
    const { currentUserMeta, loading } = this.state;

    if (!currentUser() || currentUser().id === user.id) {
      return null;
    }

    if (loading)
      return <Button loading>Loading</Button>;

    return (
      <Button onClick={this.buttonHandler}>
        {currentUserMeta.isFollower ? 'Following' : 'Follow'}
      </Button>
    );
  }
}
