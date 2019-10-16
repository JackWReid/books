import React, { Component } from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';
import { getCollectionBooks } from '../services';
import { BookImage } from '../components/Images';

class CollectionListItem extends Component {
  constructor() {
    super();
    this.state = {
      collectionBooks: [],
    };
  }

  componentWillMount() {
    getCollectionBooks({
      collection: this.props.collection.id,
      limit: 3,
      errorHandler: error => console.error(error),
      callback: response => this.setState({collectionBooks: response}),
    });
  }

  render() {
    const { collection } = this.props;
    const { collectionBooks } = this.state;

    return (
      <li {...css({
        display: 'block',
        position: 'relative',
        width: '100%',
        marginBottom: '10px',
        background: '#FFEFE6',
      })}>
        <Link
          to={`/collection/${collection.id}`}
          {...css({
            display: 'flex',
            textDecoration: 'none',
            color: 'inherit',
          })}>
          <div {...css({
            flex: '1',
            padding: '10px',
          })}>
            <h1 {...css({
              margin: '0',
              fontWeight: 'normal',
              fontSize: '24px',
            })}>{collection.title}</h1>
            <p {...css({
              position: 'absolute',
              bottom: '0',
              right: '0',
              padding: '3px 5px',
              fontSize: '14px',
              color: 'white',
              backgroundColor: '#EF4339',
              borderRadius: '5px 0 0 5px',
              zIndex: '10',
            })}>
              {collection.book_count} books
            </p>
            <p>{collection.description}</p>
          </div>
          <div {...css({
            display: 'flex',
            flex: '1',
            padding: '10px',
            backgroundColor: '#FFDBC5',
          })}>
            {collectionBooks.map((book, i) => (
              <div key={i} {...css({flex: '1'})}>
                <BookImage bookData={book} />
              </div>
            ))}
          </div>
        </Link>
      </li>
    );
  }
}

const CollectionList = ({collections}) => (
  <ul {...css({
    margin: '0',
    padding: '10px',
    display: 'block',
    listStyle: 'none',
  })}>
    {collections.map((collection, index) => <CollectionListItem key={index} collection={collection} />)}
  </ul>
);

export default CollectionList;
