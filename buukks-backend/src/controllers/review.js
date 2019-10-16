import knex from '../db/connection';

export function createBookReview(request, response) {
  return knex('reviews')
  .first('*')
  .where({
    'user_id': request.user.id,
    'book_id': request.params.id,
  })
  .then(existingReview => {
    if (existingReview)
      return response.status(400).json({message: 'Review already exists'});

    return knex('reviews')
    .insert({
      'user_id': request.user.id,
      'book_id': request.params.id,
      'rating': parseInt(request.body.rating),
      'review': request.body.review,
    })
    .returning('*')
    .then(review => response.status(200).json(review));
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}

export function deleteBookReview(request, response) {
  return knex('reviews')
  .first('*')
  .where({
    'user_id': request.user.id,
    'book_id': request.params.id,
  })
  .then(existingReview => {
    if (!existingReview)
      return response.status(400).json({message: 'No review exists'});

    return knex('reviews')
    .where({
      'user_id': request.user.id,
      'book_id': request.params.id,
    })
    .delete()
    .then(review => response.status(200).json(review));
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}

export function getReviewsByUser(request, response) {
  return knex('reviews')
  .select([
    'users.username',
    'users.first_name',
    'users.last_name',
    'reviews.user_id',
    'reviews.book_id',
    'reviews.rating',
    'reviews.review',
    'reviews.created_at',
  ])
  .where({'user_id': request.params.id})
  .join('users', 'reviews.user_id', '=', 'users.id')
  .orderBy('reviews.created_at', 'asc')
  .then(reviews => {
    if (reviews.length === 0)
      return response.status(204).json([]);

    return response.status(200).json(reviews.map(item => ({
      user: {
        id: item.user_id,
        username: item.username,
        first_name: item.first_name,
        last_name: item.last_name,
      },
      review: {
        book: item.book_id,
        rating: item.rating,
        review: item.review,
        created_at: item.created_at,
      }
    })));
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}

export function getReviewsForBook(request, response) {
  return knex('reviews')
  .select([
    'users.username',
    'users.first_name',
    'users.last_name',
    'reviews.user_id',
    'reviews.book_id',
    'reviews.rating',
    'reviews.review',
    'reviews.created_at',
  ])
  .where(request.query.filter_user ? {
    'book_id': request.params.id,
    'user_id': request.query.filter_user || '',
  } : {
    'book_id': request.params.id,
  })
  .join('users', 'reviews.user_id', '=', 'users.id')
  .orderBy('reviews.created_at', 'asc')
  .limit(request.query.limit || 20)
  .offset(request.query.offset || 0)
  .then(reviews => {
    if (reviews.length === 0)
      return response.status(204).json([]);

    return response.status(200).json(reviews.map(item => ({
      user: {
        id: item.user_id,
        username: item.username,
        first_name: item.first_name,
        last_name: item.last_name,
      },
      review: {
        book: item.book_id,
        rating: item.rating,
        review: item.review,
        created_at: item.created_at,
      }
    })));
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}
