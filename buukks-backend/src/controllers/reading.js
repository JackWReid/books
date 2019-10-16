import knex from '../db/connection';

export function getUserCurrentlyReading(request, response) {
  return knex('user_to_book')
  .first('book_id')
  .where({
    'user_id': request.params.id,
    'status': 'reading',
  })
  .then(relation => {
    if (!relation)
      return response.status(200).json({});

    return knex('user_to_book')
    .first('book_id')
    .where({
      'user_id': request.params.id,
      'book_id': relation.book_id,
      'status': 'finished',
    })
    .then(book_finished_relation => {
      if (book_finished_relation)
        return response.status(204).json({});
      
      return knex('books')
      .first('*')
      .where({'id': relation.book_id})
      .then(book => {
        if (!book)
          return response.status(204).json({});

        return response.status(200).json(book);
      });
    });
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}

export function getUserRegisteredBooks(request, response) {
  return knex.select('*')
  .from('books')
  .where({'register_user': request.params.id})
  .orderBy('created_at', 'desc')
  .limit(request.query.limit || 20)
  .offset(request.query.offset || 0)
  .then(results => {
    if (results.length === 0) {
      return response.status(200).json([]);
    } else {
      return response.status(200).json(results);
    }
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}

export function getUserStartedBooks(request, response) {
  return knex('user_to_book')
  .where({
    'status': 'finished',
    'user_id': request.params.id,
  })
  .join('books', 'user_to_book.book_id', '=', 'books.id')
  .orderBy('user_to_book.created_at', 'desc')
  .limit(request.query.limit || 20)
  .offset(request.query.offset || 0)
  .select('*')
  .then(results => {
    if (results.length === 0) {
      return response.status(200).json([]);
    } else {
      return response.status(200).json(results);
    }
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}
