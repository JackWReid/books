import React, { Component } from 'react';
import { css } from 'glamor';
import { addBookToCollection } from '../../services';
import { EmbeddedSearch, BoundingColumn } from '../../components';
import { Button } from '../../components';

export default class AddBookToCollection extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
    };
  }

  addBook = book => {
    const { collection } = this.props;
    addBookToCollection({
      book: book,
      collection: collection,
      errorHandler: error => console.error(error),
      callback: () => window.location.reload(),
    });
  }

  render() {
    const { expanded } = this.state;

    const ActionButton = ({book}) => (
      <Button onClick={() => this.addBook(book)}>Add</Button>
    );

    return (
      <div
        {...css({
          padding: '10px',
          backgroundColor: expanded ? '#FFEFE6' : '#FFDBC5',
          transition: 'all .3s ease-in-out',
        })}>
        <h1
          onClick={() => this.setState({expanded: !expanded})}
          {...css({
          textAlign: 'center',
          margin: '0',
          fontSize: '16px',
          cursor: 'pointer',
        })}>
          Add A Book
        </h1>
        <BoundingColumn>
          {expanded && <EmbeddedSearch ActionButton={ActionButton} />}
        </BoundingColumn>
      </div>
    );
  }
}
