import React, { Component } from 'react';
import { Link } from 'react-router';
import { css } from 'glamor';
import { currentUser } from '../../auth';
import { getFeed } from '../../services';
import { ActivityList } from '../../components/ActivityList';
import { LoadingPanel, BoundingColumn } from '../../components';

const drawerFromBottom = css.keyframes('drawerFromBottom', {
  '0%': { transform: 'translateY(100vh)' },
  '100%': { transform: 'translateY(0)' },
});

export default class HomeFeed extends Component {
  constructor() {
    super();
    this.state = {
      feedData: null,
      loading: true,
    }
  }

  componentDidMount = () => this.loadFeed();

  loadFeed = () => {
    getFeed({
      errorHandler: error => console.error(error),
      callback: feedData => this.setState({feedData, loading: false}),
    });
  }

  render() {
    const { feedData, loading } = this.state;

    if (loading)
      return <LoadingPanel />

    if (feedData.length === 0) {
      return <div {...css({
        paddingBottom: '20px',
      })}>
        <BoundingColumn>
          <h1>Hey {currentUser().first_name}</h1>
          <h2>Welcome to Buukks, there's nothing in your home feed...</h2>
          <p>This is a tragic turn of events that nobody could have predicted. <Link to="/search">Go check out search</Link> and follow some people, find some books.</p>
        </BoundingColumn>
      </div>;
    }

    return (
      <div {...css({
        paddingBottom: '20px',
        animation: `${drawerFromBottom} .3s`,
      })}>
        <h1 {...css({textAlign: 'center'})}>Whaddup {currentUser().first_name}</h1>
        <h2 {...css({textAlign: 'center'})}>Here's what's going on.</h2>
        <BoundingColumn>
          <ActivityList feed={feedData} />
        </BoundingColumn>
      </div>
    );
  }
}
