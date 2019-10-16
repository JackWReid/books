import React, { Component } from 'react';
import { Link } from 'react-router';
import { getAllUsers } from '../services/user';

import { ContentColumn } from '../layout';
import { Loading } from '../components';
import { PageHeader } from '../components/headers';

export default class People extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: null,
    }
  }

  componentWillMount() {
    getAllUsers((response) => {
      this.setState({userList: response});
    });
  }

  render() {
    const { userList } = this.state;

    if (!userList)
      return <Loading />

    return <div>
      <PageHeader>All Users</PageHeader>
      <ContentColumn>
        <ul>
          {userList.map((user, iterator) => {
            return <li key={iterator}><Link to={`/people/${user.publicId}`}>{user.username}</Link></li>
          })}
        </ul>
      </ContentColumn>
    </div>
  }
}
