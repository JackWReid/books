import { compareSync } from 'bcryptjs';
import knex from '../db/connection';

export function comparePasswords(userPassword, databasePassword) {
  return compareSync(userPassword, databasePassword);
}

export function loginRequired(request, response, next) {
  if (!request.user) { return response.status(401).send('Unauthorized'); }
  return next();
}

export function loginRedirect(request, response, next) {
  if (request.user) { return response.status(401).json({message: 'Already logged in'}); }
  return next();
}

export function adminRequired(request, response, next) {
  if (!request.user) { response.status(401).send('Unauthorized'); }
  return knex('users').where({
    username: request.user.username,
  }).first()
  .then((user) => {
    if (!user.admin) { return response.status(401).send('Insufficient permissions'); }
    return next();
  })
  .catch((error) => {
    response.status(500).json({message: error});
  });
}
