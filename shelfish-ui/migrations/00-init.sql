CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  author TEXT,
  image_url TEXT,
  description TEXT,
  status_read TEXT DEFAULT 'unread',
  status_owned TEXT,
  isbn TEXT UNIQUE,
  isbn13 TEXT UNIQUE,
  asin TEXT UNIQUE,
  oku_id TEXT UNIQUE,
  goodreads_id TEXT UNIQUE,
  amazon_id TEXT UNIQUE,
  date_published TIMESTAMP,
  date_last_event TIMESTAMP,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS book_event (
  event_type TEXT,
  oku_id INTEGER,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (event_type, oku_id, date_created),
  FOREIGN KEY (oku_id) REFERENCES book(oku_id)
);

CREATE TABLE IF NOT EXISTS job_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_type TEXT NOT NULL,
  job_status TEXT DEFAULT 'pending',
  payload TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cache_oku_feed (
  feed_type TEXT,
  build_date TIMESTAMP,
  json JSON,
  PRIMARY KEY (feed_type, build_date)
);

CREATE TABLE IF NOT EXISTS cache_goodreads_book (
  isbn TEXT NOT NULL PRIMARY KEY,
  json JSON,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER IF NOT EXISTS update_status_read_after_insert
AFTER INSERT ON book_event
FOR EACH ROW
BEGIN
  UPDATE book
  SET
    status_read = NEW.event_type,
    date_updated = CURRENT_TIMESTAMP,
    date_last_event = NEW.date_created
  WHERE oku_id = NEW.oku_id
    AND NEW.date_created = (SELECT MAX(date_created) FROM book_event WHERE oku_id = NEW.oku_id);
END;

CREATE TRIGGER IF NOT EXISTS update_status_read_after_update
AFTER UPDATE ON book_event
FOR EACH ROW
BEGIN
  UPDATE book
  SET
    status_read = NEW.event_type,
    date_updated = CURRENT_TIMESTAMP,
    date_last_event = NEW.date_created
  WHERE oku_id = NEW.oku_id
    AND NEW.date_created = (SELECT MAX(date_created) FROM book_event WHERE oku_id = NEW.oku_id);
END;
