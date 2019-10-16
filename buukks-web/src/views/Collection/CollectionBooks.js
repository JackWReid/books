import React, { Component } from 'react';
import { currentUser } from '../../auth';
import { getCollectionBooks, removeBookFromCollection } from '../../services';
import { Button } from '../../components';
import { BookList } from '../../components/BookList';

export default class CollectionBooks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collectionBooks: null,
      loading: true,
    }
  }

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks() {
    const { collection } = this.props;

    return getCollectionBooks({
      collection: collection.id,
      errorHandler: error => { console.error(error); return this.setState({loading: false}); },
      callback: collectionBooks => this.setState({collectionBooks, loading: false}),
    });
  }

  removeBookFromCollection = book => {
    const { collection } = this.props;

    this.setState({loading: true});
    return removeBookFromCollection({
      collection: collection.id,
      book: book,
      errorHandler: error => { console.error(error); return this.setState({loading: false}); },
      callback: collectionBooks => {
        this.setState({collectionBooks, loading: false});
        window.location.reload();
      },
    });
  }

  render() {
    const { collection } = this.props;
    const { collectionBooks, loading } = this.state;
    const isMyCollection = currentUser() && currentUser().id === collection.creator_user;

    const ActionButton = ({book}) => {
      if (!isMyCollection)
        return null;

      return <Button small loading={loading} onClick={() => this.removeBookFromCollection(book)}>Remove From Collection</Button>;
    }

    if (loading)
      return <div>Loading...</div>

    return (
      <div>
        { collectionBooks && collectionBooks.length > 0 && <BookList books={collectionBooks} ActionButton={ActionButton} /> }
        { collectionBooks.length === 0 && <div>No books in this collection yet!</div> }
      </div>
    );
  }
}
