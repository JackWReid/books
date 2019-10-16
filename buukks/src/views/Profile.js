import React, { Component } from 'react';
import { style } from 'glamor';
import { Link } from 'react-router';

import { getUserByUid } from '../services/user';
import { getBookById, getBooksByCreator } from '../services/book';
import { getUserReading } from '../services/reading';

import { ContentColumn } from '../layout';
import { PageHeader } from '../components/headers';
import Loading from '../components/Loading';

const ProfileCard = ({user}) => {
  return (
    <div {...style({
      display: 'flex',
      margin: '40px 0',
      padding: '20px',
      backgroundColor: '#FFEFE6',
    })}>
      <div>
        <h1>{user.username}</h1>
        <p>{user.publicId}</p>
      </div>
    </div>
  );
}

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      userReading: null,
      booksCreated: null,
    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const { params: { uid } } = this.props;
    getUserByUid(uid, (response) => {
      this.setState({userData: response});
    });

    getUserReading(uid, (response) => {
      const oldCurrent = response.current;
      getBookById(response.current.bookId, (response) => {
        const newState = {
          ...oldCurrent,
          ...response,
        }
        this.setState({userReading: newState});
      });
    });

    getBooksByCreator(uid, (response) => {
      this.setState({booksCreated: response});
    });
  }

  render() {
    const { userData, userReading, booksCreated } = this.state;

    if (!userData)
      return <Loading />

    return <div>
      <PageHeader>Profile</PageHeader>
      <ContentColumn>
        <ProfileCard user={userData} />
        { userReading && <p>Currently Reading: <Link to={`/book/${userReading.bookId}`}>
          {userReading.title} by {userReading.author}
          </Link></p> }
        { booksCreated && <div>
          <p>Books created by {userData.username}</p>
          <ul>
            {booksCreated.map((book, iterator) => {
              return <li key={iterator}>
                <Link to={`/book/${book.publicId}`}>
                  {book.title}
                </Link>
              </li>
            })}
          </ul>
        </div>}
      </ContentColumn>
    </div>
  }
}
