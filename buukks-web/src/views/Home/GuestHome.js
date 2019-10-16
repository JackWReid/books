import React from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';
import { BoundingColumn, Button } from '../../components';

const GuestHome = () => (
  <div {...css({width: '100%', paddingBottom: '50px'})}>
      <div {...css({
        padding: '50px 0 30px',
        textAlign: 'center',
        color: '#FFF',
        backgroundColor: '#EF4339',
      })}>
        <BoundingColumn>
          <h1 {...css({
            margin: '0',
            fontFamily: 'Inconsolata',
            fontSize: '4em',
          })}>
          Buukks
          </h1>
          <h2 {...css({
            fontWeight: 'normal'
          })}>
            ...whacha reading?
          </h2>
        </BoundingColumn>
      </div>
      <div {...css({
        padding: '20px',
      })}>
        <BoundingColumn>
          <div {...css({
            display: 'flex',
            justifyContent: 'center',
            padding: '10px 0 0',
          })}>
            <Button {...css({marginRight: '10px'})}>
              <Link to={`/login`}>
                Login
              </Link>
            </Button>
            <Button>
              <Link to={`/login?mode=signup`}>
                Sign Up
              </Link>
            </Button>
          </div>
        </BoundingColumn>
      </div>
      <div>
        <BoundingColumn>
          <h2>Keep Reading Lists</h2>
          <p>Keep a log of what you want to read by creating collections. Curate your reading aspirations by theme, or whatever you want really. Your collections will be public, so as to inspire others on their own reading.</p>
          <h2>Let Friends Know What You're Reading</h2>
          <p>Mark books as Currently Reading to let your friends know what you're tucking into right now.</p>
          <h2>Review Books</h2>
          <p>Tip your mates off to underappreaciated tomes or let everybody know that you think this year's hyped read is overhyped trash, your choice.</p>
          <h2>Be The First</h2>
          <p>If you're searching for a book on Buukks and it's not turning up, congrats! You get to be the first the Register the book in the community. Simply search in Register mode and click Register to be the first to have brought it to Buukks's attention, for all time.</p>
        </BoundingColumn>
      </div>
  </div>
);

export default GuestHome;
