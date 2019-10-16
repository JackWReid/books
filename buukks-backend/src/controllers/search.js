import fetch from 'node-fetch';
import qs from 'qs';
import knex from '../db/connection';
import { selectBestGoogleBooksImage, publicUser } from '../utilities';



/* eslint-disable quotes */
export function searchBooks(request, response) {
  const limit = request.query.limit || 20;
  const offset = request.query.offset || 0;

  return knex.select('*')
  .from('books')
  .whereRaw("LOWER(title) LIKE '%' || LOWER(?) || '%' ", request.query.q)
  .union(function() {
    this.select('*')
    .from('books')
    .whereRaw("LOWER(author) LIKE '%' || LOWER(?) || '%' ", request.query.q);
  })
  .orderBy('created_at', 'desc')
  .limit(limit)
  .offset(offset)
  .then(results => {
    return response.status(200).json(results);
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}
/* eslint-disable quotes */



export function searchGoogle(request, response) {
  const queryOptions = {
    q: request.query.q,
    maxResults: request.query.limit || 20,
    startIndex: request.query.offset || 0,
    orderBy: 'relevance',
    printType: 'books',
  };

  fetch(`https://www.googleapis.com/books/v1/volumes?${qs.stringify(queryOptions)}`)
  .then(response => response.json())
  .then(results => {
    const filteredResult = results.items.filter(item => !!item.volumeInfo.author || !!item.volumeInfo.authors);
    return response.status(200).json(filteredResult.map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.author || item.volumeInfo.authors[0] || null,
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description,
      image_url: selectBestGoogleBooksImage(item.volumeInfo.imageLinks) || undefined,
    })));
  });
}


/* eslint-disable quotes */
export function searchUsers(request, response) {
  const limit = request.query.limit || 20;
  const offset = request.query.offset || 0;

  return knex.select(publicUser())
  .from('users')
  .whereRaw("LOWER(username) LIKE '%' || LOWER(?) || '%' ", request.query.q)
  .union(function() {
    this.select(publicUser())
    .from('users')
    .whereRaw("LOWER(first_name) LIKE '%' || LOWER(?) || '%' ", request.query.q)
    .union(function() {
      this.select(publicUser())
      .from('users')
      .whereRaw("LOWER(last_name) LIKE '%' || LOWER(?) || '%' ", request.query.q);
    });
  })
  .limit(limit)
  .offset(offset)
  .then(results => {
    return response.status(200).json(results);
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}
/* eslint-enable quotes */
