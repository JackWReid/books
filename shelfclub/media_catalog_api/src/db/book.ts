import { BookAuthor, BookEdition, BookWork } from '../types/bookResources';

import { Pool } from 'pg';
const pool = new Pool();

export async function getBookAuthorByOlId(ol_id: string): Promise<BookAuthor> {
  const dbRes = await pool.query(`SELECT * FROM book_author WHERE ol_id = $1 LIMIT 1`, [ol_id]);
  return dbRes.rows[0];
}

export async function getBookEditionByOlId(ol_id: string): Promise<BookEdition> {
  const dbRes = await pool.query(`SELECT * FROM book_edition WHERE ol_id = $1 LIMIT 1`, [ol_id]);
  return dbRes.rows[0];
}

export async function getBookWorkByOlId(ol_id: string): Promise<BookWork> {
  const dbRes = await pool.query(`SELECT * from book_work WHERE ol_id = $1 LIMIT 1`, [ol_id]);
  return dbRes.rows[0];
}

export async function insertBookAuthor(author: BookAuthor): Promise<BookAuthor> {
  const dbRes = await pool.query(`INSERT INTO book_author(ol_id, date_created, date_modified, name, alternate_names, birth_date, death_date, bio, links, identifiers) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`, [
    author.ol_id,
    author.date_created,
    author.date_modified,
    author.name,
    author.alternate_names,
    author.birth_date,
    author.death_date,
    author.bio,
    author.links,
    author.identifiers,
  ]); 
  return dbRes.rows[0];
}

export async function insertBookEdition(edition: BookEdition): Promise<BookEdition> {
  const dbRes = await pool.query(`INSERT INTO book_edition(ol_id, date_created, date_modified, title, authors, publishers, publish_date, publish_places, publish_country, physical_format, identifiers) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`, [
    edition.ol_id,
    edition.date_created,
    edition.date_modified,
    edition.title,
    edition.authors,
    edition.publishers,
    edition.publish_date,
    edition.publish_places,
    edition.publish_country,
    edition.physical_format,
    edition.identifiers,
  ]); 
  return dbRes.rows[0];
}

export async function insertBookWork(work: BookWork): Promise<BookWork> {
  const dbRes = await pool.query(`INSERT INTO book_work(ol_id, date_created, date_modified, title, authors, subjects, description, links, covers, editions, identifiers) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`, [
    work.ol_id,
    work.date_created,
    work.date_modified,
    work.title,
    work.authors,
    work.subjects,
    work.description,
    work.links,
    work.covers,
    work.editions,
    work.identifiers,
  ]);

  return dbRes.rows[0];
}
