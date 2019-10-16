import express from 'express';
const router = express.Router();
import knex from '../db/connection';
import authenticate from '../auth/passport';
import { getGoogleBooksInfo, stripHTML } from '../utilities';
import { searchBooks, searchGoogle } from '../controllers/search';
import { createBookReview, deleteBookReview, getReviewsForBook } from '../controllers/review';
import { getBookById } from '../controllers/book';



router.post('/register', authenticate, function(request, response) {
  knex.table('books')
  .first('google_id')
  .where({'google_id': request.body.google_id})
  .then(result => {
    if (result) {
      return response.status(400).json({message: 'This book is already registered'});
    }

    else {
      getGoogleBooksInfo(request.body.google_id, info => {
        return knex('books').insert({
          'google_id': request.body.google_id,
          'image_url': info.image_url,
          'title': info.title,
          'author': info.author,
          'description': stripHTML(info.description),
          'register_user': request.user.id,
        })
        .returning([
          'id',
          'image_url',
          'title',
          'author',
          'description'
        ])
        .then(createdBook => {
          return response.status(200).json(createdBook[0]);
        })
        .catch(error => {
          return response.status(500).json({message: error});
        });
      });
    }
  })
  .catch(error => {
    return response.status(500).json({message: error});
  });
});



router.get('/search/', searchBooks);



router.get('/search_google', searchGoogle);



router.post('/finish', authenticate, function(request, response) {
  return knex('user_to_book')
  .first('book_id')
  .where({
    'user_id': request.user.id,
    'status': 'reading',
  })
  .then(relation => {
    if (!relation) {
      return response.status(404).json({message: 'User is not currently reading anything'});
    }

    return knex('user_to_book').insert({
      'user_id': request.user.id,
      'book_id': relation.book_id,
      'status': 'finished',
    })
    .returning('book_id')
    .then(finishedRelation => {
      return knex('user_to_book')
      .where({
        'user_id': request.user.id,
        'status': 'reading',
      })
      .delete()
      .then(() => {
        return response.status(200).json({message: `Finished book ${finishedRelation[0]}`});
      });
    });
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
});



router.get('/:id', getBookById);



router.patch('/:id', authenticate, function(request, response) {
  knex.table('books')
  .where({
    'id': request.params.id,
  })
  .update({'description': stripHTML(request.body.description)})
  .returning('*')
  .then(updates => {
    if (updates === 0) {
      return response.status(404).json({message: 'Book not found'});
    } else {
      return knex.table('books')
      .first('*')
      .where({'id': request.params.id})
      .then(result => response.status(200).json(result));
    }
  })
  .catch((error) => {
    return response.status(500).json({message: error});
  });
});



router.post('/:id/start', authenticate, function(request, response) {
  knex('books')
  .first('id')
  .where({'id': request.params.id})
  .then(book => {
    if (!book) {
      return response.status(404).json({message: 'That book doesn\'t exist'});
    }

    return knex('user_to_book')
    .first('book_id')
    .where({
      'user_id': request.user.id,
      'book_id': request.params.id,
      'status': 'reading',
    })
    .then(existingRelation => {
      if (existingRelation) {
        return response.status(200).json({message: 'User is already reading that book'});
      }

      return knex('user_to_book')
      .where({
        'user_id': request.user.id,
        'status': 'reading',
      })
      .delete()
      .then(() => {
        return knex('user_to_book')
        .insert({
          'user_id': request.user.id,
          'book_id': request.params.id,
          'status': 'reading',
        })
        .returning('book_id')
        .then(insertedBook => {
          return response.status(200).json({message: `Started book ${insertedBook[0]}`});
        });
      });
    });
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
});

router.post('/:id/review', authenticate, createBookReview);

router.delete('/:id/review', authenticate, deleteBookReview);

router.get('/:id/reviews', getReviewsForBook);

router.post('/:id/finish', authenticate, function(request, response) {
  return knex('user_to_book').insert({
    'user_id': request.user.id,
    'book_id': request.params.id,
    'status': 'finished',
    'muted': request.query.muted || false,
  })
  .returning('book_id')
  .then(finishedRelation => response.status(200).json({message: `Finished book ${finishedRelation[0]}`}))
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
});

export default router;
