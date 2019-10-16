import React, { Component } from 'react';
import { css } from 'glamor';
import ActivityListItem from './ActivityListItem';

export class ActivityList extends Component {
  render() {
    const { feed } = this.props;

    return (
      <div {...css({
        padding: '0 10px',
      })}>
        {feed.map((activity, index) => (<ActivityListItem key={index} activity={activity} />))}
      </div>
    );
  }
}
