import React, { Component, cloneElement } from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';
import { stripHTML, fadeString } from '../../utils';
import { currentUser } from '../../auth';
import { getBook } from '../../services';
import { BookImage } from '../Images';

export default class BookListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      bookData: null,
      bookMeta: null,
    };
  }

  componentWillMount() {
    if (!this.props.useShallow) {
      this.setState({loading: true});
      getBook({
        book: this.props.book.id,
        user: currentUser().id,
        callback: result => this.setState({
          loading: false,
          bookData: result.book,
          bookMeta: result.meta,
        }),
        errorHandler: error => console.error(error),
      });
    }
  }

  render() {
    const { loading, bookData, bookMeta } = this.state;
    const { children, compact, useShallow, book } = this.props;

    if (loading)
      return (<div>Loading...</div>);

    const guardedBook = {
      id: useShallow ? book.id : bookData.id,
      title: useShallow ? book.title : bookData.title,
      author: useShallow ? book.author : bookData.author,
      description: useShallow ? book.description : bookData.description,
      image_url: useShallow ? book.image_url : bookData.image_url,
    };

    return (
      <li
        {...css({
          display: compact ? 'block' : 'flex',
          marginBottom: '20px',
          clear: 'both',
          overflow: 'hidden',
        })}>
        {!compact && <div {...css({flex: '1', marginRight: '20px'})}>
          <BookImage bookData={guardedBook} bookMeta={bookMeta} />
        </div>}
        <div {...css({flex: '2'})}>
          <h1 {...css({margin: '0',fontSize: '24px'})}>
            <Link to={`/book/${guardedBook.id}`}>{guardedBook.title}</Link>
          </h1>
          <p {...css({margin: '5px 0 10px'})}><Link to={`/search?q=${guardedBook.author}&type=book`}>{guardedBook.author}</Link></p>
          {children && cloneElement(children, {book: guardedBook.id, bookMeta: bookMeta})}
          {!compact && <p>{fadeString(stripHTML(guardedBook.description), 250)}</p>}
        </div>
      </li>
    );
  }
}
