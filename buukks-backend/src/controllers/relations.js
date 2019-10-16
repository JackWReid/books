import knex from '../db/connection';
import { isValidUserId, publicUser } from '../utilities';

export function followUser(request, response) {
  const targetUserId = request.params.id;
  const followerUserId = request.user.id;

  if (!isValidUserId(targetUserId))
    return response.status(400).json({message: 'Invalid user id, must be an integer'});

  return knex('users')
  .first('id')
  .where({id: request.params.id})
  .then(user => {
    if (!user) {
      return response.status(404).json({message: 'User to follow not found'});
    }

    else {
      knex('user_to_user')
      .first('*')
      .where({
        follower: followerUserId,
        followee: targetUserId,
      })
      .then((relation) => {
        if (relation) {
          return response.status(200).json({message: 'User already follows this user'});
        }

        else {
          return knex.transaction(transaction => {
            return knex('user_to_user')
            .transacting(transaction)
            .insert({follower: followerUserId, followee: targetUserId})
            .then(() => {
              return knex('users')
              .transacting(transaction)
              .where({id: followerUserId})
              .increment('following', 1)
              .then(() => {
                return knex('users')
                .transacting(transaction)
                .first(publicUser())
                .where({id: targetUserId})
                .increment('followers', 1);
              });
            })
            .then(transaction.commit)
            .catch(transaction.rollback);
          })
          .then(followedUser => {
            return response.status(200).json(followedUser);
          });
        }
      })
      .catch(error => {
        console.error(error);
        return response.status(500).json({message: error});
      });
    }
  });
}



export function unfollowUser(request, response) {
  const targetUserId = request.params.id;
  const unfollowerUserId = request.user.id;

  if (!isValidUserId(targetUserId))
    return response.status(400).json({message: 'Invalid user id, must be an integer'});

  return knex.transaction(transaction => {
    return knex('user_to_user')
    .transacting(transaction)
    .where({follower: unfollowerUserId, followee: targetUserId})
    .delete()
    .then(() => {
      return knex('users')
      .transacting(transaction)
      .where({id: unfollowerUserId})
      .decrement('following', 1)
      .then(() => {
        return knex('users')
        .transacting(transaction)
        .first(publicUser())
        .where({id: targetUserId})
        .decrement('followers', 1);
      });
    })
    .then(transaction.commit)
    .catch(transaction.rollback);
  })
  .then(followedUser => {
    return response.status(200).json(followedUser);
  })
  .catch(error => {
    return response.status(500).json({message: error});
  });
}



export function getUserFollowing(request, response) {
  return knex('user_to_user')
  .where({'follower': request.params.id})
  .join('users', 'user_to_user.followee', '=', 'users.id')
  .select(publicUser())
  .orderBy('created_at', 'asc')
  .limit(request.query.limit || 20)
  .offset(request.query.offset || 0)
  .then(results => {
    return response.status(200).json(
      results.filter(user => user != request.params.id)
    );
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}



export function getUserFollowers(request, response) {
  return knex('user_to_user')
  .where({'followee': request.params.id})
  .join('users', 'user_to_user.follower', '=', 'users.id')
  .select(publicUser())
  .orderBy('created_at', 'asc')
  .limit(request.query.limit || 20)
  .offset(request.query.offset || 0)
  .then((results) => {
    return response.status(200).json(
      results.filter(user => user != request.params.id)
    );
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}
