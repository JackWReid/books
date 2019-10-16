import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import Helmet from 'react-helmet';
import { css } from 'glamor';
import { getUser } from '../../services/user';
import { LoadingPanel, BoundingColumn } from '../../components';
import ProfileHeader from './ProfileHeader';
import CurrentlyReading from './CurrentlyReading';
import UserFinished from './UserFinished';
import UserCollections from './UserCollections';
import UserRegisteredBooks from './UserRegisteredBooks';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      userMeta: null,
      loading: true,
    };
  }

  handleError = error => {
    console.error(error);
    this.setState({
      loading: false,
    });
  }

  handleResults = result => {
    const { params } = this.props;
    if (result.user) {
      browserHistory.push(`/user/${result.user.username}`);
      this.setState({
        userData: result.user,
        userMeta: result.meta,
        loading: false,
      });
    } else {
      browserHistory.push(`/user/${params.id}`);
    }
  }

  componentWillMount() {
    getUser({
      user: this.props.params.id,
      callback: this.handleResults,
      errorHandler: this.handleError,
    });
  }

  render() {
    const { userData, userMeta, loading } = this.state;

    if (loading) { return <LoadingPanel /> }

    if (!userData)
      return (
        <div {...css({width: '100%'})}>
          <BoundingColumn>
            <div {...css({
              marginTop: '30px',
              padding: '0 10px',
            })}>
              <h1>User not found</h1>
              <p>Yeah sorry, I have <em>no</em> idea who that is. <Link to="/search">Try search.</Link></p>
            </div>
          </BoundingColumn>
        </div>
      );

    return (
      <div {...css({width: '100%'})}>
        <Helmet title={`${userData.first_name} ${userData.last_name}`} />
        <ProfileHeader user={userData} userMeta={userMeta} />
        <BoundingColumn>
          <CurrentlyReading user={userData} />
          <UserCollections user={userData} />
          <UserFinished user={userData} />
          <UserRegisteredBooks user={userData} />
        </BoundingColumn>
      </div>
    );
  }
}

export default Profile;
