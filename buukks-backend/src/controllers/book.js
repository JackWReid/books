import knex from '../db/connection';

export function getBookById(request, response) {
  return knex('books')
  .first('*')
  .where({'id': request.params.id})
  .then(result => {
    if (!result)
      return response.status(404).json({message: 'Book not found'});

    if (!request.query.meta_user)
      return response.status(200).json({book: result});

    return knex('user_to_book')
    .select('*')
    .where({'user_id': request.query.meta_user, 'book_id': request.params.id})
    .then(user_to_book => {

      return knex('reviews')
      .first('*')
      .where({'user_id': request.query.meta_user, 'book_id': request.params.id})
      .then(review => {
        const hasFinished = !!user_to_book.find(relation => relation.status === 'finished');
        const isReading = !!user_to_book.find(relation => relation.status === 'reading');
        const hasReviewed = !!review;

        return response.status(200).json({
          book: result,
          meta: {
            hasFinished,
            isReading,
            hasReviewed,
          },
        });
      });
    });
  })
  .catch((error) => {
    return response.status(500).json({message: error});
  });
}
