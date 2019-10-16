import database from '../db';

export default async function patchBookById(req, res) {
  try {
    const { id } = req.params;
    if (Object.keys(req.body).length === 0) {
      throw new Error('No book information passed in body');
    }

    const query = buildQuery(id, req.body);
    console.info(query);
    const result = await database.query(query);
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

const whitelist = [
  'title',
  'author',
  'category',
  'description',
  'cover',
  'read',
  'own',
  'buy',
  'notes',
];

function buildQuery(id, body) {
  if (!id) {
    throw new Error('No ID for book update query');
  }
  
  const setString = Object.entries(body).reduce((acc, val, i) => {
    if (!whitelist.includes(val[0])) {
      return acc;
    }
    return acc.concat(`${i === 0 ? '' : ','} ${val[0]}='${val[1]}'`);
  }, '');

  return `UPDATE books SET ${setString} WHERE id=${id} RETURNING *`;
}
