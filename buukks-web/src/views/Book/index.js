import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { css } from 'glamor';
import { currentUser } from '../../auth';
import { getBook, getUser, editBook } from '../../services';
import { Button, BoundingColumn } from '../../components';
import { StartReadingButton, FinishReadingButton } from '../../components/ActionButtons';
import { TextArea } from '../../components/Form';
import { BookImage } from '../../components/Images';
import BookHeader from './BookHeader';
import BookReviews from './BookReviews';

export default class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookData: null,
      registerUserData: null,
      loading: false,
      editing: false,
      editingDescription: null,
    };
  }

  componentWillMount = () => this.getBook();

  getBook = () => {
    const book = this.props.params.id;

    getBook({
      book,
      errorHandler: error => console.error(error),
      callback: bookData => {
        getUser({
          user: bookData.book.register_user,
          errorHandler: error => console.error(error),
          callback: registerUserData => {
            this.setState({
              bookData: bookData.book,
              bookMeta: bookData.meta,
              registerUserData,
              loading: false,
            });
          },
        });
      }
    });

  }

  editBook = () => {
    const { bookData } = this.state;

    this.setState({
      editing: true,
      editingDescription: bookData.description,
    });
  }

  updateBookEdit = e => {
    this.setState({editingDescription: e.target.value});
  }

  saveEdits = e => {
    e.preventDefault();
    const { editingDescription, bookData } = this.state;
    this.setState({loading:true});
    editBook({
      book: bookData.id,
      edits: { description: editingDescription },
      errorHandler: error => console.error(error),
      callback: bookData => this.setState({
        bookData,
        loading: false,
        editing: false,
      }),
    });
  }

  render() {
    const { bookData, bookMeta, userData, loading, editing, editingDescription } = this.state;

    if (loading)
      return <div>Loading...</div>

    if (!bookData)
      return null;

    if (bookData.message)
      return (
        <div {...css({width: '100%'})}>
          <BoundingColumn>
            <div {...css({
              marginTop: '30px',
              padding: '0 10px',
            })}>
              <h1>Book not found</h1>
              <p>Yeah sorry, I have <em>no</em> idea what that is. <Link to="/search">Try search.</Link></p>
            </div>
          </BoundingColumn>
        </div>
      );

    return (
      <div {...css({width: '100%', paddingBottom: '20px'})}>
        <Helmet title={bookData.title} />
        <BookHeader
          book={bookData}
          user={userData}
          editBook={this.editBook}
          saveEdits={this.saveEdits}
          editing={editing} />
        <BoundingColumn>
          <div {...css({
            width: '100%',
            maxWidth: '300px',
            margin: '0 auto',
            padding: '20px',
          })}>
            <BookImage bookData={bookData} bookMeta={bookMeta} />
          </div>
          {bookMeta && <div {...css({
            display: 'flex',
            justifyContent: 'center',
          })}>
            {!bookMeta.isReading && <StartReadingButton {...css({marginRight: '10px'})} book={bookData.id} bookMeta={bookMeta} />}
            {!bookMeta.hasFinished && <FinishReadingButton book={bookData.id} bookMeta={bookMeta} muted />}
          </div>}
          <div {...css({padding: '0 20px'})}>
            {editing ?
              <form onSubmit={this.submitBookEdit}>
                <TextArea
                  value={editingDescription}
                  onChange={this.updateBookEdit}>
                  {editingDescription}
                </TextArea>
              </form> : <p>{bookData.description}</p>}
            {currentUser() && !editing && <Button onClick={this.editBook}>Edit</Button>}
            {currentUser() && editing && <Button onClick={this.saveEdits}>Save</Button>}
          </div>
        </BoundingColumn>
        <BookReviews bookData={bookData} bookMeta={bookMeta} />
      </div>
    );
  }
}
