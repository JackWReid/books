import React, { Component } from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';
import { currentUser } from '../../auth';
import { getUserCollections } from '../../services';
import { CollectionList, Button } from '../../components';

export default class UserCollections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collectionList: [],
      loading: true,
    };
  }

  componentDidMount = () => this.loadCollectionData();

  loadCollectionData = () => {
    const { user } = this.props;
    getUserCollections({
      user: user.id,
      callback: results => this.handleResults(results),
      errorHandler: error => this.handleError(error),
    });
  }

  handleResults = results => {
    this.setState({
      collectionList: results,
      loading: false,
    });
  }

  handleError = error => {
    this.setState({
      collectionList: [],
      loading: false,
    });
  }

  render() {
    const { loading, collectionList } = this.state;
    const { user } = this.props;

    if (loading)
      return <div>Loading...</div>;

    const isMyProfile = user.id === currentUser().id;

    return (
      <div>
        <h1
          {...css({
            margin: '16px 0 0 10px',
            fontSize: '24px',
          })}>
          Collections
        </h1>
        <CollectionList collections={collectionList} />
        {isMyProfile && <div {...css({padding: '0 10px'})}>
          <Button><Link to="/collection/create">Create New Collection</Link></Button>
        </div>}
      </div>
    );
  }
}
