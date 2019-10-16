import request from 'axios';

const headers = {
  'Authorization': 'Bearer keyTN2iDJmWOgQ6X6',
};

const apiUrl = 'https://api.airtable.com/v0/appuujoDxDQaOOS1i';

const categoryMap = {
  'rec23yYRQGjBiwDXM': 'Science',
  'rec4idpNu3qGiu3CU': 'Computer Science',
  'rec57etvP1zGidXqd': 'Language',
  'rec5nmVJrHtbRwpE9': 'History & Geography',
  'recH4MiVwu1vzgxm5': 'Technology',
  'recMbYxWWcsVUoOGz': 'Arts',
  'recU0t3Rw3m4Ke0xl': 'Social Sciences',
  'reclVJZpgrk2GW6Hi': 'Literature',
  'recqK08aVikfVFBy5': 'Religion',
  'recrxdarkfIdOhQ8e': 'Philosophy & Psychology',
};

async function transformAuthor(author) {
  if (!author) {
    return '';
  }

  const { data } = await request(`${apiUrl}/Authors/${author}`, {headers});
  return data.fields.Name;
}

async function transformBook(book) {
  const author = await transformAuthor(book.fields.Author);
  return {
    id: book.id,
    title: book.fields.Title,
    author,
    category: categoryMap[book.fields.Category[0]],
    description: book.fields.Description,
    cover: book.fields.Cover && book.fields.Cover[0].thumbnails.large.url,
  };
}

async function transformBooks(books) {
  const transformMap = books.map(transformBook);
  return await Promise.all(transformMap);
}

export async function getBookById(id) {
  const res = await request(`${apiUrl}/Books/${id}`, {headers});
  return await transformBook(res.data);
}

export async function getAllBooks({ limit = 50 } = {}) {
  const res = await request(`${apiUrl}/Books`, {headers});
  return await transformBooks(res.data.records);
}

export async function searchBooks({ query = '', limit = 50 } = {}) {
  const filterByFormula = `OR(FIND(LOWER("${query}"),LOWER(Title)),FIND(LOWER("${query}"),LOWER(Author)))`;
  const res = await request(`${apiUrl}/Books`, {headers, params: {filterByFormula}});
  return await transformBooks(res.data.records);
}
