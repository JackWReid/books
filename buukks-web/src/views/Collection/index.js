import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { css } from 'glamor';
import { getCollection } from '../../services';
import { currentUser } from '../../auth';
import { BoundingColumn } from '../../components';
import CollectionHeader from './CollectionHeader';
import CollectionBooks from './CollectionBooks';
import AddBookToCollection from './AddBookToCollection';

export default class Collection extends Component {
  constructor() {
    super();
    this.state = {
      collectionData: null,
      loading: true,
    };
  }

  componentDidMount() {
    getCollection({
      collection: this.props.params.id,
      errorHandler: error => {
        this.setState({
          collectionData: null,
          loading: false,
        });
      },
      callback: results => {
        this.setState({
          collectionData: results,
          loading: false,
        });
      },
    });
  }

  render() {
    const { loading, collectionData } = this.state;

    if (loading)
      return <div>Loading...</div>;

    if (collectionData.message)
      return (
        <div {...css({width: '100%'})}>
          <BoundingColumn>
            <div {...css({
              marginTop: '30px',
              padding: '0 10px',
            })}>
              <h1>Collection not found</h1>
              <p>Yeah sorry, I have <em>no</em> idea what that is. <Link to="/search">Try search.</Link></p>
            </div>
          </BoundingColumn>
        </div>
      );


    const isMyCollection = currentUser().id === collectionData.creator_user;

    return (
      <div {...css({width: '100%'})}>
        <Helmet title={collectionData.title} />
        <CollectionHeader collection={collectionData} />
        { isMyCollection && <AddBookToCollection collection={collectionData.id} /> }
        <BoundingColumn>
          <CollectionBooks collection={collectionData} />
        </BoundingColumn>
      </div>
    );
  }
}
