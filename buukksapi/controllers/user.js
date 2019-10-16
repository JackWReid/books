const uuid = require('uuid');
const omit = require('lodash/omit');
const User = require('../models/user');


function unlessError(error, response, resourceCheck, fn) {
  if (error) { return response.status(500).json({ message: error.message }); }
  else if (!resourceCheck) { return response.status(404).json({ message: 'Not found' }); }
  else { return fn(); }

}

exports.getUsers = function(request, response) {
  User.find().lean().exec((error, users) => {
    unlessError(error, response, !!users,
      () => response.json(users.map(user => omit(user, ['reading'])))
    );
  });
};

exports.getUserById = function(request, response) {
  User.findOne({publicId: request.params.uid}).lean().exec((error, user) => {
    unlessError(error, response, !!user,
      () => response.json(omit(user, ['reading']))
    );
  });
};

exports.getMe = function(request, response) {
  User.findOne({publicId: request.user.publicId}).lean().exec((error, user) => {
    unlessError(error, response, !!user,
      () => response.json(omit(user, ['reading']))
    );
  });
};

/**
* [POST] Create a new user
* - Find a user with the username requested
* - If user with username found, return a 500
* - Create a new User instance with request data
* - Save the new user
**/
exports.postUser = function(request, response) {
  User.findOne({username: request.body.username}).lean().exec((error, user) => {
    unlessError(error, response, !!user,
      () => { if (user) { return response.status(500); }}
    );
  });

  const newUser = new User({
    publicId: uuid.v1(),
    username: request.body.username,
    password: request.body.password,
    isOnboarded: false,
    relations: {
      follows: [],
      following: [],
    }
  });

  newUser.save((error, user) => {
    unlessError(error, response, !!user,
      () => response.json(user)
    );
  });
};

/**
* [POST] Follow a user
* - Find the user to be followed
* - If the user can't be found, 404
* - If the following user isn't in their followers, push them in
* - Save the followed user
* - Find the user following
* - If the followed user isn't in their following, push them in
* - Save the following user
* - Respond to req with the following user
**/
exports.followUser = function(request, response) {
  User.findOne({publicId: request.params.uid}).exec((error, user) => {
    unlessError(error, response, !!user, () => {
      if (
        !user.relations.followers.find(follow => follow.user === request.user.publicId)
        && request.params.uid !== request.user.publicId
      ) {
        user.relations.followers.push({
          user: request.user.publicId,
          dateCreated: new Date(),
        });
      }
      user.save(error => unlessError(error, response, !!user, () => null));

      User.findOne({publicId: request.user.publicId}).exec((error, user) => {
        unlessError(error, response, !!user, () => {
          if (
            !user.relations.following.find(follow => follow.user === request.params.uid)
            && request.params.uid !== request.user.publicId
          ) {
            user.relations.following.push({
              user: request.params.uid,
              dateCreated: new Date(),
            });
          }

          user.save((error, user) => {
            unlessError(error, response, !!user, () => response.json(user), !!user);
          });
        });
      });

    });
  });
};

exports.unfollowUser = function(request, response) {
  User.findOne({publicId: request.params.uid}).exec(function(error, user) {
    unlessError(error, response, !!user, () => {
      user.relations.followers = user.relations.followers.filter(thisId => thisId === request.user.publicId);
      user.save(function(error, request) {
        unlessError(error, request, !!user, () => null);
      });

      User.findOne({publicId: request.user.publicId}).exec(function(error, user) {
        unlessError(error, response, !!user, () => {
          request.relations.following = request.relations.following.filter(thisId => thisId === request.params.uid);
          user.save(function(error, user) {
            if (error) { return response.status(500).json({ message: 'Error unfollowing user'}); }
            response.json(user);
          });
        });
      });

    });
  });
};

exports.userOnboarded = function(request, response) {
  User.findOne({publicId: request.user.publicId}).exec(function(error, user) {
    unlessError(error, response, !!user, () => {
      user.isOnboarded = true;
      user.save(function(error, user) {
        if (error){ return response.status(500).json({ message: 'Error setting user as onboarded'}); }
        response.json(user);
      });
    });
  });
};
