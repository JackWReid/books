import database from '../db';

export default async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const query = buildQuery(id);
    console.info(query);
    const result = await database.query(query);
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

function buildQuery(id) {
  return `SELECT * FROM books WHERE id=${id} LIMIT 1`;
}
