const pgwire = require('pgwire');
const elasticsearch = require('@elastic/elasticsearch');
const { zip } = require('lodash');

const PG_CONFIG = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  hostname: process.env.PGHOST,
  port: 5432,
}
const PG_REPL_SLOT = 'esindex';
const ES_ENDPOINT = 'https://search-media-catalog-search-z3gsis7qfvy6pz4aaoo37a3uq4.us-east-2.es.amazonaws.com';

let pgClient;
const esClient = new elasticsearch.Client({ node: ES_ENDPOINT });

function transformRecord(change) {
  return Object.fromEntries(zip(change.columnnames, change.columnvalues));
}

function parseChanges(changes) {
  const authorChanges = [];
  const workChanges = [];
  const editionChanges = [];
  const skipped = [];

  for (const change of changes) {
    if (change.kind === 'delete') {
      skipped.push(change);
    } else if (change.table === 'book_author') {
      authorChanges.push(transformRecord(change));
    } else if (change.table === 'book_work') {
      workChanges.push(transformRecord(change));
    } else if (change.table === 'book_edition')
      editionChanges.push(transformRecord(change));
    else {
      skipped.push(change);
    }
  }

  return {authorChanges, workChanges, editionChanges, skipped};
}

function recordsAsGenerator(records) {
  return async function * generator() {
    for (const record of records) {
      yield record;
    }
  }
}

async function main() {
  let iterCount = 0;

  console.log(`Connecting to PG host: ${PG_CONFIG.hostname}`);
  pgClient = await pgwire.connect(PG_CONFIG, {
    replication: 'database',
  });

  try {
    console.log('Loading replication stream');
    const replicationStream = await pgClient.logicalReplication({
      slot: PG_REPL_SLOT,
      startLsn: process.env.LAST_LSN || '0/0',
    });

    process.on('SIGINT', _ => {
      replicationStream.destroy();
    });

    for await (const { lsn, data } of replicationStream) {
      const update = JSON.parse(data.toString());
      const { authorChanges, workChanges, editionChanges, skipped } = parseChanges(update.change);

      console.log(JSON.stringify({
        iteration: iterCount,
        authorChanges: authorChanges.length,
        workChanges: workChanges.length,
        editionChanges: editionChanges.length,
        skippedChanges: skipped.length,
        changeLength: update.change.length, 
        lsn
      }));

      const authorChangeGenerator = recordsAsGenerator(authorChanges);
      const workChangeGenerator = recordsAsGenerator(workChanges);
      const editionChangeGenerator = recordsAsGenerator(editionChanges);

      const authorRes = await esClient.helpers.bulk({
        concurrency: 1,
        flushBytes: 10000,
        datasource: authorChangeGenerator(),
        onDocument (doc) {
          return {
            index: { _index: 'book_author' }
          }
        }
      });

      const workRes = await esClient.helpers.bulk({
        concurrency: 1,
        flushBytes: 10000,
        datasource: workChangeGenerator(),
        onDocument (doc) {
          return {
            index: { _index: 'book_work' }
          }
        }
      });

      const editionRes = await esClient.helpers.bulk({
        concurrency: 1,
        flushBytes: 10000,
        datasource: editionChangeGenerator(),
        onDocument (doc) {
          return {
            index: { _index: 'book_edition' }
          }
        }
      });

      console.log(JSON.stringify({
        authors: authorRes,
        works: workRes,
        editions: editionRes,
      }));

      replicationStream.ack(lsn);
      iterCount++;
      lastLasn = lsn;
    }
  } finally {
    pgClient.end();
  }
}

main();
