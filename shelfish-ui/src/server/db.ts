import { Database } from "bun:sqlite";
import {
  type DbBook,
  type OkuBookEntry,
  type OkuBookEventEntry,
  type OkuFeedName,
  type ReadStatus,
} from "./types.ts";
import { dbDate, olderThanHours } from "../utils.ts";

let dbSingleton: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbSingleton !== null) {
    return dbSingleton;
  }

  const newDb = new Database("./shelfish.sqlite", { create: true });
  await runInitialSchema(newDb);
  dbSingleton = newDb;
  return newDb;
}

export async function runInitialSchema(db: Database) {
  const schemaFile = Bun.file("./migrations/00-init.sql");
  const schemaText = await schemaFile.text();
  console.log("Initializing database schema");
  db.run(schemaText);
}

export async function insertFeedCache(feedType: OkuFeedName, feed) {
  const db = await getDb();
  const insert = db.prepare(
    "INSERT OR IGNORE INTO cache_oku_feed (feed_type, build_date, json) VALUES ($feed_type, $build_date, $json)",
  );

  const result = insert.run({
    $feed_type: feedType,
    $build_date: dbDate(feed.lastBuildDate),
    $json: JSON.stringify(feed),
  });

  return result;
}

export async function getOkuFeedCache(feedType: OkuFeedName) {
  const db = await getDb();
  const query = db.prepare(
    "SELECT build_date, json FROM cache_oku_feed WHERE feed_type = $feed_type ORDER BY build_date DESC LIMIT 1",
  );

  const result = await query.get({ $feed_type: feedType });

  if (!result) {
    return null;
  }

  if (olderThanHours(24 * 7, result.build_date)) {
    return null;
  }

  return JSON.parse(result.json);
}

export async function insertOkuBookRecords(
  books: OkuBookEntry[],
): Promise<number> {
  const db = await getDb();
  const insert = db.prepare(`
    INSERT OR IGNORE
    INTO book (oku_id, title, author, image_url, description, date_published)
    VALUES ($oku_id, $title, $author, $image_url, $description, $pub_date)
    `);

  const insertBooks = db.transaction((books: OkuBookEntry[]) => {
    for (const book of books) {
      const insertBook = {
        $oku_id: book.Guid,
        $title: book.Title,
        $author: book.Author,
        $image_url: book.ImageUrl,
        $description: book.Description,
        $pub_date: dbDate(book.PubDate),
      };
      insert.run(insertBook);
    }
    return books.length;
  });

  const count = await insertBooks(books);
  return count;
}

export async function insertOkuBookEvents(
  bookEvents: OkuBookEventEntry[],
): Promise<number> {
  const db = await getDb();
  const insert = db.prepare(`
    INSERT OR IGNORE INTO
    book_event (event_type, oku_id, date_created) VALUES ($event_type, $oku_id, $date_created)
  `);
  const insertBookEvents = db.transaction((events: OkuBookEventEntry[]) => {
    for (const event of events) {
      const insertBookEvents = {
        $event_type: event.EventType,
        $oku_id: event.BookGuid,
        $date_created: dbDate(event.Date),
      };
      insert.run(insertBookEvents);
    }

    return events.length;
  });

  const count = await insertBookEvents(bookEvents);
  return count;
}

export async function getBookById(bookId: string): Promise<DbBook> {
  const db = await getDb();
  const query = db.prepare(`SELECT * FROM book WHERE id = $id`);
  const book: DbBook = await query.get({ $id: bookId });
  return book;
}

export async function getBooks(): Promise<DbBook[]> {
  const db = await getDb();
  const query = db.prepare(`SELECT * FROM book ORDER BY date_last_event DESC`);
  const books: DbBook[] = await query.all();
  return books;
}

export async function getBooksByReadStatus(
  readStatus: ReadStatus,
): Promise<DbBook[]> {
  const db = await getDb();
  const query = db.prepare(
    `SELECT * FROM book WHERE status_read = $status_read`,
  );
  const books: DbBook[] = await query.all({ $status_read: readStatus });
  return books;
}

export async function getBookStats() {
  const db = await getDb();
  const query = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM book WHERE status_read = 'read') as read,
      (SELECT COUNT(*) FROM book WHERE status_read = 'reading') as reading,
      (SELECT COUNT(*) FROM book WHERE status_read = 'toread') as toread
  `);
  const result = await query.get();
  return result;
}

export async function getBooksBySearch(params: { search: string }) {
  if (!params.search) {
    return [];
  }

  const db = await getDb();
  const query = db.prepare(`
    SELECT * FROM book WHERE title LIKE $search
  `);
  const books: DbBook[] = query.all({ $search: `%${params.search}%` });
  return books;
}
