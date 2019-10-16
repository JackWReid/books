import React, { Component } from 'react';
import request from 'axios';
import uniqBy from 'lodash.uniqby';

import {
  Container,
  PlainList,
  SpreadItem,
  SmallLink,
  LinkyButton,
  SingleRowForm,
  WideInput,
  SubmitLink
} from '../styles';

const AddButton = ({ state, onClick }) => {
  if (state === 'adding') {
    return (
      <LinkyButton disabled onClick={() => null}>
        Loading
      </LinkyButton>
    );
  }

  if (state === 'previewed') {
    return <LinkyButton onClick={onClick}>Add</LinkyButton>;
  }

  return null;
};

const AddList = ({ items = [], addBook = () => null }) => (
  <PlainList>
    {items.map((item, key) => {
      if (item.state === 'error') {
        return <li key={key}>Nothing found for {item.isbn}</li>;
      }

      if (item.state === 'loading') {
        return <li key={key}>Loading preview for {item.isbn}</li>;
      }

      if (item.state === 'added') {
        return (
          <SpreadItem key={key}>
            <span>
              <SmallLink to={`/book/${item.data.id}`}>
                {item.data.title}
              </SmallLink>{' '}
              added
            </span>
          </SpreadItem>
        );
      }

      if (['previewed', 'adding'].includes(item.state)) {
        return (
          <SpreadItem key={key}>
            <span>
              {item.data.title} by {item.data.author} ({item.isbn})
            </span>
            <AddButton state={item.state} onClick={() => addBook(item)} />
          </SpreadItem>
        );
      }

      return null;
    })}
  </PlainList>
);

const AddForm = ({ onChange, onSubmit, formState, value }) => (
  <SingleRowForm onChange={onChange} onSubmit={onSubmit}>
    <WideInput placeholder="ISBN (13-digit)" name="isbn" value={value} />
    <SubmitLink type="submit" value="Preview Book" />
  </SingleRowForm>
);

export default class AddPage extends Component {
  state = {
    formIsbn: '',
    formState: 'ready',
    previewItems: []
  };

  async getPreviewInfo({ title, author, isbn }) {
    const { data } = await request({
      method: 'post',
      url: 'https://api.jackreid.xyz/preview',
      data: {
        title,
        author,
        isbn,
      }
    });
    return data;
  }

  async postAddBook(bookItem) {
    const { data } = await request({
      method: 'post',
      url: `https://api.jackreid.xyz/add/${bookItem.isbn}`
    });
    return data;
  }

  async addBook(bookItem) {
    const previewItems = this.state.previewItems.map(item => {
      if (bookItem.isbn === item.isbn) {
        item.state = 'adding';
      }

      return item;
    });

    this.setState({ previewItems: uniqBy(previewItems, ({ isbn }) => isbn) });

    try {
      const addedBook = await this.postAddBook(bookItem);
      const previewItems = this.state.previewItems.map(item => {
        if (bookItem.isbn === item.isbn) {
          item.state = 'added';
          item.data = addedBook;
        }

        return item;
      });
      this.setState({ previewItems });
    } catch (error) {
      console.log(error);
      const previewItems = this.state.previewItems.map(item => {
        if (bookItem.isbn === item.isbn) {
          item.state = 'error';
        }

        return item;
      });
      this.setState({ previewItems: uniqBy(previewItems, ({ isbn }) => isbn) });
    }
  }

  onChange = e => this.setState({ formIsbn: e.target.value });

  async onSubmit(e) {
    e.preventDefault();
    const submittedIsbn = this.state.formIsbn.replace('-', '');
    const newListItem = {
      isbn: submittedIsbn,
      state: 'loading',
      data: null
    };
    const previewItems = [...this.state.previewItems, newListItem];
    this.setState({ formState: 'loading', formIsbn: '', previewItems });
    try {
      const previewItemData = await this.getPreviewInfo({ isbn: submittedIsbn });
      const processedPreviewItems = previewItems.map(item => {
        if (item.isbn === submittedIsbn) {
          item.state = 'previewed';
          item.data = previewItemData;
        }

        return item;
      });

      return this.setState({
        formState: 'ready',
        previewItems: processedPreviewItems
      });
    } catch (error) {
      console.error(error);
      const processedPreviewItems = previewItems.map(item => {
        if (item.isbn === submittedIsbn) {
          item.state = 'error';
        }

        return item;
      });

      return this.setState({
        formState: 'ready',
        previewItems: processedPreviewItems
      });
    }
  }

  render() {
    return (
      <Container>
        <h1>Add Books</h1>
        <AddList
          items={this.state.previewItems}
          addBook={item => this.addBook(item)}
        />
        <AddForm
          onChange={this.onChange}
          onSubmit={e => this.onSubmit(e)}
          formState={this.state.formState}
          value={this.state.formIsbn}
        />
      </Container>
    );
  }
}
