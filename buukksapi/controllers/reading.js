const omit = require('lodash/omit');
const User = require('../models/user');

exports.getUserReading = function(request, response) {
  User.findOne({publicId: request.params.uid}).lean().exec((error, user) => {
    if (error)
      return response.status(500).json({ message: 'Error getting user currently reading'});
    else if (!user)
      return response.status(404).json(null);
    else if (!user.reading)
    return response.status(404).json(null);

    response.json(user.reading);
  });
}

exports.getUsersByCurrentlyReading = function(request, response) {
  User.find({'reading.current.bookId': request.params.uid}).lean().exec((error, users) => {
    if (error)
      return response.status(500).json({ message: 'Error setting user currently reading'});

    response.json(users.map(user => omit(user, ['profile'])));
  });
}

exports.putUserCurrentReading = function(request, response) {
  const readingItem = {
    dateBegan: new Date(),
    sentiments: request.body.sentiments,
    bookId: request.body.bookId,
  };

  User.findOne({publicId: request.user.publicId}, (error, user) => {
    if (error)
      return response.status(500).json({ message: 'Error setting user currently reading'});

    user.reading.current = readingItem;
    user.save((error, user) => {
      if (error)
        return response.status(500).json({ message: 'Error setting user currently reading'});

      response.json(user.reading);
    });

  });
}


exports.finishUserCurrentReading = function(request, response) {
  User.findOne({publicId: request.user.publicId}).exec((error, user) => {
    if (error)
      return response.status(500).json({ message: 'Error getting user currently reading'});
    else if (!user)
      return response.status(404).json(null);
    else if (!user.reading)
    return response.status(404).json(null);
    else if (!user.reading.current)
    return response.status(404).json(null);

    const wasCurrentlyReading = {
      dateBegan: user.reading.current.dateBegan,
      dateEnded: new Date(),
      bookId: user.reading.current.bookId,
      sentiments: user.reading.current.sentiments,
    }

    if (user.reading.finished) {
      const bookAlreadyFinished = user.reading.finished.find((item) => {
        return item.bookId === wasCurrentlyReading.bookId});
      if (bookAlreadyFinished)
        return response.status(500).json({ message: 'User already finished this book'});
      user.reading.finished.push(wasCurrentlyReading);
    } else {
      user.reading.finished = [wasCurrentlyReading];
    }

    user.reading.current = null;

    user.save((error, user) => {
      if (error)
        return response.status(500).json({ message: 'Error adding to user finished reading'});

      response.json(user.reading);
    });
  });
}
