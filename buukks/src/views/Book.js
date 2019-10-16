import React, { Component } from 'react';
import { Link } from 'react-router';
import { fullDate, timeAgo } from '../utils/dates';

import { getBookById } from '../services/book';
import { getUsersByCurrentlyReading } from '../services/reading';
import { getUserByUid } from '../services/user';

import { ContentColumn } from '../layout';
import { PageHeader } from '../components/headers';
import { Loading } from '../components';

export default class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookData: null,
      creatorData: null,
      readersData: null,
      loading: true,
    }
  }

  componentWillMount() {
    const { uid } = this.props.params;
    getBookById(uid, (response) => {
      this.setState({ bookData: response });
      getUserByUid(response.creator, (response) => {
        this.setState({
          creatorData: response,
        });
        getUsersByCurrentlyReading(uid, (response) => {
          this.setState({
            readersData: response,
            loading: false,
          });
        });
      });
    });
  }

  render() {
    const { bookData, creatorData, readersData, loading } = this.state;
    if (loading) { return <Loading /> }

    return (
        <div>
          <PageHeader>Book Catalog</PageHeader>
          <ContentColumn>
            <h1>{bookData.title}</h1>
            <h2>{bookData.author}</h2>
            <p><em>Created {fullDate(bookData.dateCreated)}</em></p>
            <p>Created by <Link to={`/people/${creatorData.publicId}`}>{creatorData.username}</Link></p>

            { readersData.length > 0 &&
              <div>
              <h3>Current Readers</h3>
              <ul>
                {readersData.map((reader, iterator) => {
                  return <li key={iterator}>
                    {reader.username} ({timeAgo(reader.reading.current.dateBegan)}): "{reader.reading.current.sentiments}"
                  </li>;
                })}
              </ul>
              </div> }
          </ContentColumn>
        </div>
    );
  }
}
