import React, { Component } from 'react';
import { Link } from 'react-router';
import { style } from 'glamor';
import { getBookById } from '../services/book';
import { Loading } from './';

export default class BookCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookInfo: null,
    };
  }

  componentWillMount() {
    const { book } = this.props;
    getBookById(book, (response) => {
      this.setState({ bookInfo: response });
    });
  }

  render() {
    const { sentiments } = this.props;

    if (!this.state.bookInfo) { return <Loading /> }

    const { title, author, publicId } = this.state.bookInfo;

    return (
      <div {...style({margin: '20px 0', padding: '10px', background: '#FFEFE6'})}>
        <h1 {...style({fontSize: '1.5rem', margin: '0'})}>
          <Link {...style({color: 'inherit', textDecoration: 'none'})} to={`/book/${publicId}`}>
            {title}
          </Link>
        </h1>
        <h2 {...style({fontSize: '1rem'})}>
          {author}
        </h2>
        { sentiments && <p {...style({fontSize: '1rem', lineHeight: '1.4'})}>"{sentiments}"</p> }
      </div>
    );
  }
}
