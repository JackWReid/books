import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { RadioGroup, Radio } from 'react-radio-group';
import { css } from 'glamor';
import { TextInput, SubmitButton } from '../../components/Form';
import { BoundingColumn } from '../../components';

export default class SearchBox extends Component {
  constructor(props) {
    super(props);
    const { initialQuery, initialSearchType } = this.props;
    this.state = {
      searchQuery: initialQuery,
      queryType: initialSearchType || 'book',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      searchQuery: nextProps.initialQuery,
      queryType: nextProps.initialSearchType,
    });
  }

  handleToggle = event => {
    this.setState({queryType: event});
  }

  updateForm = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  submitForm = event => {
    event.preventDefault();
    const { searchQuery, queryType } = this.state;
    if (searchQuery) {
      browserHistory.push(`/search?q=${searchQuery}&type=${queryType}`);
    }
  }

  render() {
    const { searchQuery, queryType } = this.state;

    const isBookSelected = queryType === 'book';

    const placeholderText = isBookSelected
      ? 'Search for books by title or author'
      : 'Search for users';

    return (
      <div {...css({
        width: '100%',
        padding: '10px',
        background: '#FFEFE6',
      })}>
        <BoundingColumn>
          <form onChange={this.updateForm} onSubmit={this.submitForm}>
            <div {...css({
              display: 'flex',
              alignItems: 'stretch',
            })}>
              <TextInput
                name="searchQuery"
                value={searchQuery}
                placeholder={placeholderText} />
              <SubmitButton>Search</SubmitButton>
            </div>
            <div {...css({ marginTop: '10px' })}>
              <RadioGroup selectedValue={queryType} onChange={this.handleToggle}>
                <Radio value='book' />Book
                <Radio value='user' {...css({ marginLeft: '10px' })} />User
              </RadioGroup>
            </div>
          </form>
        </BoundingColumn>
      </div>
    );
  }
}
