import axios from 'axios';
import cheerio from 'cheerio';
import database from '../db';
import { buildQuery } from './getBooks';

export default async function getCurrentlyReading(req, res) {
  try {
    const { data } = await axios('https://www.goodreads.com/user/show/54047855-jack-reid');
    const document = cheerio.load(data);
    const titles = document('#currentlyReadingReviews .bookTitle').map((i, el) => document(el).text()).get();
    const authors = document('#currentlyReadingReviews .authorName').map((i, el) => document(el).text()).get();
    const books = titles.map((title, i) => ({ title, author: authors[i] }));
    const responseData = [];

    for (let book of books) {
      const query = buildQuery({...book});

      const res = await database.query(query);

      if (res.rows.length === 1) {
        responseData.push(res.rows[0]); 
      } else {
        responseData.push(book);
      }
    }

    return res.end(JSON.stringify(responseData));
  } catch (error) {
    console.error(error);
    return res.status(500).end(JSON.stringify({ message: 'Internal Server Error' }));
  }
}
