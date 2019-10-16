import { Client } from 'pg';

require('dotenv').config();

const client = new Client({
    user: 'books',
    host: process.env.BOOKS_DB_HOST,
    database: 'books',
    password: process.env.BOOKS_DB_PASSWORD,
    port: '5432',
});

export default client;
