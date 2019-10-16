import knex from '../db/connection';

export function getFeed(request, response) {
  return knex('user_to_user')
  .where({'user_to_user.follower': request.user.id})
  .join('user_to_book', function() {
    if (!request.query.actor) {
      this.on('user_to_book.user_id', '=', request.user.id);
      this.orOn('user_to_book.user_id', '=', 'user_to_user.followee');
    }

    else if (request.query.actor === 'self') {
      this.on('user_to_book.user_id', '=', request.user.id);
    }

    else if (request.query.actor === 'others') {
      this.on('user_to_book.user_id', '=', 'user_to_user.followee');
    }
  })
  .where({'user_to_book.muted': false})
  .join('books', 'user_to_book.book_id', '=', 'books.id')
  .join('users', 'user_to_book.user_id', '=', 'users.id')
  .orderBy('user_to_book.created_at', 'desc')
  .limit(request.query.limit || 20)
  .offset(request.query.offset || 0)
  .select([
    'users.id',
    'users.username',
    'users.first_name',
    'users.last_name',
    'users.bio',
    'users.following',
    'users.followers',
    'users.admin',
    'user_to_book.status',
    'user_to_book.book_id',
    'user_to_book.created_at',
    'books.google_id',
    'books.image_url',
    'books.title',
    'books.author',
    'books.description',
  ])
  .then(bookEvents => {
    if (bookEvents.length === 0) {
      return response.status(200).json([]);
    } else {
      return response.status(200).json(bookEvents.map(event => ({
        created_at: event.created_at,
        type: event.status,
        user: {
          id: event.id,
          username: event.username,
          first_name: event.first_name,
          last_name: event.last_name,
          bio: event.bio,
          following: event.following,
          followers: event.followers,
          admin: event.admin,
        },
        book: {
          id: event.book_id,
          google_id: event.google_id,
          image_url: event.image_url,
          title: event.title,
          author: event.author,
          description: event.description,
        }
      })));
    }
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}
