import React, { Component } from 'react';
import { style } from 'glamor';
import { input, field, label } from '../styles/forms';

import { PrimaryButton } from './buttons';

class EditCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      author: '',
      sentiments: '',
    }
  }

  updateForm(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { save, cancel } = this.props;
    const { title, author, sentiments } = this.state;

    const showAuthor = title;
    const showSentiments = author;
    const showSave = sentiments && author && title;

    const fieldStyle = {
      author: {
        ...field,
        transition: 'all .2s ease-in',
        opacity: showAuthor ? '1' : '0',
        height: showAuthor ? 'auto' : '0',
        marginBottom: showAuthor ? '1em' : '0' },
      sentiments: {
        ...field,
        transition: 'all .2s ease-in',
        opacity: showSentiments ? '1' : '0',
        height: showSentiments ? 'auto' : '0',
        marginBottom: showSentiments ? '1em' : '0' },
      save: {
        ...field,
        transition: 'all .2s ease-in',
        opacity: showSave ? '1' : '0',
        height: showSave ? 'auto' : '0',
        marginBottom: showSave ? '1em' : '0' },
    }

    return (
      <form onSubmit={save} {...style({margin: '0 auto', maxWidth: '800px', width: '100%', padding: '10px', background: '#FFEFE6'})}>
        <div {...style({...field, marginBottom: showAuthor ? '1em': '0'})}>
          <label {...style(label)} htmlFor="title">Title</label>
          <input {...style(input)} onChange={this.updateForm.bind(this)} name="title" value={title} />
        </div>
        <div {...style(fieldStyle['author'])}>
          <label {...style(label)} htmlFor="author">Author</label>
          <input {...style(input)} onChange={this.updateForm.bind(this)} name="author" {...style(input)} value={author} />
        </div>
        <div {...style(fieldStyle['sentiments'])}>
          <label {...style(label)} htmlFor="sentiments">Comments</label>
          <textarea {...style({...input, height: '120px'})} onChange={this.updateForm.bind(this)} name="sentiments" value={sentiments} />
        </div>
        <div {...style(fieldStyle['save'])}>
          <PrimaryButton action="submit">Save</PrimaryButton>
          <PrimaryButton action={cancel}>Cancel</PrimaryButton>
        </div>
      </form>
    );
  }
}

export default EditCard;
