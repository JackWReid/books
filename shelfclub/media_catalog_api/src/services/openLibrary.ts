import { OpenLibraryAuthor, OpenLibraryBook, OpenLibraryWork } from '../types/openLibraryResources';

import axios from 'axios';

const OPEN_LIBRARY_API_HOST = 'https://openlibrary.org';

async function getBookAuthorByOlId(ol_id: string): Promise<OpenLibraryAuthor> {
  const res = await axios.get(`${OPEN_LIBRARY_API_HOST}/authors/${ol_id}.json`, { params: { jscmd: 'data' }});
  return res.data;
}

async function getBookEditionByOlId(ol_id: string): Promise<OpenLibraryBook> {
  const res = await axios.get(`${OPEN_LIBRARY_API_HOST}/books/${ol_id}.json`, { params: { jscmd: 'data' }});
  return res.data;
}

async function getBookWorkByOlId(ol_id: string): Promise<OpenLibraryWork> {
  const res = await axios.get(`${OPEN_LIBRARY_API_HOST}/works/${ol_id}.json`, { params: { jscmd: 'data' }});
  return res.data;
}

async function getBookWorkSearchResult(title: string, author: string, ol_id: string) {
  const res = await axios.get(`${OPEN_LIBRARY_API_HOST}/search.json`, {
    params: {
      jscmd: 'data',
      title,
      author,
    }
  });
  const workMatchingId = res.data.docs.find((result: any) => result.key === `/works/${ol_id}`);
  return workMatchingId;
}

export default {
  getBookAuthorByOlId,
  getBookEditionByOlId,
  getBookWorkByOlId,
  getBookWorkSearchResult,
};
