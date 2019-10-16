import database from '../db';

export default async function getBooks(req, res) {
  try {
    const params = filterValidParams(req.query);
    const query = buildQuery(params);
    console.info(query);
    const result = await database.query(query);
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

const validParams = [
  'title',
  'author',
  'own',
  'read',
  'buy',
  'limit',
  'offset',
];

function filterValidParams(params) {
  const outputParams = {};

  Object.entries(params).forEach(param => {
    if (validParams.includes(param[0])) {
      outputParams[param[0]] = param[1];
    }
  });

  return outputParams;
}

export function buildQuery(params) {
  let whereStringFragments = [];
  let pageStringFragments = [];

  if (params.own) {
    whereStringFragments.push(`own=${params.own}`);
  }

  if (params.read) {
    whereStringFragments.push(`read=${params.read}`);
  }

  if (params.buy) {
    whereStringFragments.push(`buy=${params.buy}`);
  }

  if (params.title) {
    whereStringFragments.push(`LOWER(title) LIKE LOWER('%${params.title}%')`);
  }

  if (params.author) {
    whereStringFragments.push(`LOWER(author) LIKE LOWER('%${params.author}%')`);
  }

  if (params.limit) {
    pageStringFragments.push(`LIMIT ${params.limit}`);
  }

  if (params.offset) {
    pageStringFragments.push(`OFFSET ${params.offset}`);
  }

  let string = 'SELECT * FROM books ';
  let pageString = pageStringFragments.join(' ');
  let whereString = '';
  whereStringFragments.forEach((fragment, i) => {
    if (i === 0) {
      return whereString = `WHERE ${fragment}`;
    }

    return whereString = whereString + ` AND ${fragment}`;
  });

  return string + whereString + ' ' + pageString;
}
