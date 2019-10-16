import knex from '../db/connection';



export function createCollection(request, response) {
  return knex('collections').insert({
    'title': request.body.title,
    'description': request.body.description,
    'creator_user': request.user.id,
  })
  .returning('*')
  .then(createdCollection => response.status(200).json(createdCollection[0]))
  .catch(error => response.status(500).json(error));
}



export function deleteCollection(request, response) {
  return knex('collections')
  .where({
    'id': request.params.id,
    'creator_user': request.user.id,
  })
  .delete()
  .then(result => {
    if (result === 0)
      return response.status(404).json({message: 'No collection you can delete was found'});

    return knex('book_to_collection')
    .where({'collection_id': request.params.id})
    .delete()
    .then(() => response.status(200).json({message: 'Deleted collection'}));
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json(error);
  });
}



export function getCollectionById(request, response) {
  return knex.table('collections')
  .first('*')
  .where({'id': request.params.id})
  .then(result => {
    if (!result)
      return response.status(404).json({message: 'Collection not found'});

    return response.status(200).json(result);
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json(error);
  });
}



export function getCollectionBooks(request, response) {
  return knex('book_to_collection')
  .where({'collection_id': request.params.id})
  .join('books', 'book_to_collection.book_id', '=', 'books.id')
  .select('*')
  .orderBy('book_to_collection.created_at', 'desc')
  .limit(request.query.limit || 20)
  .offset(request.query.offset || 0)
  .then(results => {
    if (results.length === 0)
      return response.status(404).json([]);

    else
      return response.status(200).json(results);
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json(error);
  });
}



export function addBookToCollection(request, response) {
  return knex('collections')
  .first('*')
  .where({
    'id': request.params.collection_id,
    'creator_user': request.user.id,
  })
  .then(result => {
    if (!result) {
      return response.status(404).json({message: 'User cannot add books to this collection'});
    } else {
      knex('book_to_collection')
      .first('*')
      .where({
        'book_id': request.params.book_id,
        'collection_id': request.params.collection_id,
      })
      .then(existingRelation => {
        if (existingRelation) {
          return response.status(200).json(existingRelation);
        } else {
          return knex.transaction(transaction => {
            return knex('book_to_collection')
            .transacting(transaction)
            .insert({
              'book_id': request.params.book_id,
              'collection_id': request.params.collection_id,
            })
            .returning('*')
            .then(createdRelation => {
              return knex('collections')
              .transacting(transaction)
              .where({id: createdRelation[0].collection_id})
              .increment('book_count', 1)
              .returning('*');
            })
            .then(transaction.commit)
            .catch(transaction.rollback);
          })
          .then(updatedCollections => {
            return response.status(200).json(updatedCollections[0]);
          });
        }
      });
    }
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json(error);
  });
}


export function removeBookFromCollection(request, response) {
  return knex('collections')
  .where({
    'id': request.params.collection_id,
    'creator_user': request.user.id
  })
  .then(foundCollections => {
    if (foundCollections.length === 0)
      return response.status(404).json({message: 'No collection user owns found'});

    return knex('book_to_collection')
    .where({
      'collection_id': request.params.collection_id,
      'book_id': request.params.book_id,
    })
    .delete()
    .then(result => {
      if (result === 0) {
        return response.status(404).json({message: 'Book is not part of collection'});
      }

      return knex('collections')
      .where({'id': request.params.collection_id})
      .decrement('book_count', 1)
      .returning('*')
      .then(() => {
        knex('book_to_collection')
        .where({'collection_id': request.params.collection_id})
        .join('books', 'book_to_collection.book_id', '=', 'books.id')
        .select('*')
        .orderBy('book_to_collection.created_at', 'desc')
        .then(results => {
          console.log(results);
          if (results.length === 0) {
            return response.status(404).json([]);
          } else {
            return response.status(200).json(results);
          }
        });
      })
      .catch(error => {
        console.error(error);
        return response.status(500).json(error);
      });
    });
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json(error);
  });
}



export function getUserCollections(request, response) {
  return knex.select('*')
  .from('collections')
  .where({'creator_user': request.params.id})
  .orderBy('created_at', 'asc')
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
