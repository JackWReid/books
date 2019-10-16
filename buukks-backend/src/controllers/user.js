import knex from '../db/connection';
import { genSaltSync, hashSync } from 'bcryptjs';
import { publicUser, filterObject } from '../utilities';


export function getMe(request, response) {
  return response.status(200).json(filterObject(request.user, publicUser(false)));
}

export function getUser(request, response) {
  if (isNaN(parseInt(request.params.id))) {
    return getUserByUsername(request, response);
  } else {
    return getUserById(request, response);

  }
}


function getUserByUsername(request, response) {
  return knex('users')
  .first(publicUser())
  .where({username: request.params.id})
  .then((userInfo) => {
    if (!userInfo)
      return response.status(404).json({message: 'User not found'});

    getUserRelations(userInfo.id, userRelations => {
      if (!request.query.meta_user)
        return response.status(200).json({
          user: Object.assign(userInfo, userRelations),
        });

      getUserMeta(userInfo.id, request.query.meta_user, userMeta => {
        return response.status(200).json({
          user: Object.assign(userInfo, userRelations),
          meta: userMeta,
        });
      });
    });
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}

function getUserById(request, response) {
  return knex('users')
  .first(publicUser())
  .where({id: request.params.id})
  .then((userInfo) => {
    if (!userInfo)
      return response.status(404).json({message: 'User not found'});


    getUserRelations(userInfo.id, userRelations => {
      if (!request.query.meta_user)
        return response.status(200).json({
          user: Object.assign(userInfo, userRelations),
        });

      getUserMeta(userInfo.id, request.query.meta_user, userMeta => {
        return response.status(200).json({
          user: Object.assign(userInfo, userRelations),
          meta: userMeta,
        });
      });
    });
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}


function getUserMeta(target, current, callback) {
  return knex.table('user_to_user')
  .select('*')
  .where({
    'follower': current,
    'followee': target,
  })
  .orWhere({
    'followee': current,
    'follower': target,
  })
  .then(meta => {
    return callback({
      isFollower: !!meta.find(relation => relation.followee === target),
      isFollowee: !!meta.find(relation => relation.follower === target),
    });
  });
}


function getUserRelations(target, callback) {
  return knex('user_to_user')
  .count('*')
  .where({'followee': target})
  .then(followers => {
    return knex('user_to_user')
    .count('*')
    .where({'follower': target})
    .then(following => {
      callback({
        followers: followers[0].count,
        following: following[0].count,
      });
    });
  });
}


export function createUser(request, response) {
  const hash = hashSync(request.body.password, genSaltSync());
  return knex('users').insert({
    username: request.body.username,
    password: hash,
    first_name: request.body.first_name,
    last_name: request.body.last_name,
    email: request.body.email,
  })
  .returning(publicUser())
  .then((createdUser) => {
    response.status(200).json(createdUser[0]);
  })
  .catch((error) => {
    console.error(error);
    response.status(500).json({message: error});
  });
}


export function updateUser(request, response) {
  const updateFields = filterObject(request.body, ['first_name', 'last_name', 'bio']);

  if (updateFields.length === 0)
    return response.status(400).json({message: 'No valid fields found to update'});

  return knex('users')
  .where({id: request.user.id})
  .update(updateFields)
  .returning(publicUser())
  .then(userInfo => {
    return response.status(200).json(userInfo[0]);
  })
  .catch(error => {
    console.error(error);
    return response.status(500).json({message: error});
  });
}
