import React, { Component } from 'react';
import { css } from 'glamor';
import { browserHistory } from 'react-router';
import { createCollection } from '../../services';
import { BoundingColumn } from '../../components';
import { TextInput, TextArea, SubmitButton, Label } from '../../components/Form';

export default class CreateCollection extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      description: '',
      loading: false,
    };
  }

  updateTitle = event => {
    event.preventDefault();
    this.setState({title: event.target.value});
  }

  updateDescription = event => {
    event.preventDefault();
    this.setState({description: event.target.value});
  }

  submitForm = event => {
    event.preventDefault();
    this.setState({loading: true});
    createCollection({
      collection: this.state,
      callback: collection => browserHistory.push(`/collection/${collection.id}`),
      errorHandler: error => console.error(error),
    })
  }

  render() {
    const { loading } = this.state;

    return (
      <div {...css({width: '100%', padding: '10px'})}>
        <BoundingColumn>
          <h1 {...css({textAlign: 'center'})}>Create A New Collection</h1>
          <form onSubmit={this.submitForm}>
            <Label>Title</Label>
            <TextInput onChange={this.updateTitle} placeholder="e.g. Post-postmodern Americana" />
            <Label>Description</Label>
            <TextArea onChange={this.updateDescription} placeholder="e.g. The only way I can show people that I'm still relevant." />
            <div {...css({
              marginTop: '10px'
            })}>
              <SubmitButton loading={loading}>Create</SubmitButton>
            </div>
          </form>
        </BoundingColumn>
      </div>
    );
  }
}
