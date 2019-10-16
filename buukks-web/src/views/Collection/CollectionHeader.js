import React, { Component } from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';
import { getUser } from '../../services';

export default class CollectionHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collectionCreator: null,
    }
  }

  componentDidMount() {
    const { collection } = this.props;

    return getUser({
      user: collection.creator_user,
      errorHandler: error => console.error(error),
      callback: collectionCreator => this.setState({collectionCreator}),
    });
  }

  render() {
    const { collection } = this.props;
    const { collectionCreator } = this.state;

    return (
      <div {...css({
        padding: '20px',
        textAlign: 'center',
        background: '#FFEFE6',
      })}>
        <div {...css({
          display: 'inline-block',
          margin: '0 auto',
          padding: '5px',
          fontSize: '10px',
          textAlign: 'center',
          backgroundColor: '#EF4339',
          color: 'white',
          textTransform: 'uppercase',
          borderRadius: '5px',
        })}>
          Collection
        </div>
        <h1 {...css({
          margin: '10px 0 0 0',
        })}>{collection.title}</h1>
        <p>{collection.description}</p>
        {collectionCreator && <p>Created by <Link to={`/user/${collectionCreator.user.id}`}>{collectionCreator.user.first_name} {collectionCreator.user.last_name}</Link></p>}
      </div>
    );
  }
}
