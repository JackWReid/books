import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { style } from 'glamor';

import { createNewBook } from '../services/book';
import { getUserReading, updateCurrentlyReading, finishCurrentlyReading } from '../services/reading';

import { ContentColumn } from '../layout';
import { Loading, BookCard, EditCard, BookList } from '../components';
import { PrimaryButton } from '../components/buttons';
import { PageHeader } from '../components/headers';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userReading: null,
      loading: true,
    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const { user } = this.props;
    getUserReading(user.publicId, (response) => {
      this.setState({
        userReading: response,
        loading: false,
      });
    });
  }

  createNewBook(event) {
    event.preventDefault();
    const newBook = {
      title: event.target.title.value,
      author: event.target.author.value,
    }

    const newSentiment = event.target.sentiments.value;
    const token = Cookies.get('buukksAuth');
    this.setState({loading: true});

    createNewBook(token, newBook, (book) => {
      updateCurrentlyReading(token, {
        sentiments: newSentiment,
        bookId: book.publicId,
      }, (reading) => {
        this.setState({
          userReading: reading,
          loading: false,
        });
      });
    });
  }

  finishCurrentlyReading(event) {
    event.preventDefault();
    this.setState({loading: true});
    const token = Cookies.get('buukksAuth');
    finishCurrentlyReading(token, (reading) => {
      this.setState({
        userReading: reading,
        loading: false,
      });
    });
  }

  render() {
    const { userReading, loading } = this.state;
    const { user } = this.props;

    if (!user) { return <Loading /> }
    if (loading) { return <Loading /> }

    return (
      <div>
        { !userReading.current && <div>
          <PageHeader>Currently Reading</PageHeader>
          <ContentColumn>
            <div {...style({margin: '20px 0'})}>
              <EditCard save={this.createNewBook.bind(this)} cancel={() => false} />
            </div>
          </ContentColumn>
        </div> }

        { userReading.current && <div>
          <PageHeader>Currently Reading</PageHeader>
          <ContentColumn>
            <BookCard book={userReading.current.bookId} sentiments={userReading.current.sentiments} />
            <PrimaryButton action={this.finishCurrentlyReading.bind(this)}>I finished that book</PrimaryButton>
          </ContentColumn>
        </div> }


        { userReading.finished && userReading.finished.length > 0 && <div>
          <PageHeader>Finished Reading</PageHeader>
          <ContentColumn>
            <BookList list={userReading.finished} />
          </ContentColumn>
        </div> }
      </div>
    );
  }
}

export default Dashboard;
