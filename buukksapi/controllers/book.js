const uuid = require('uuid');
const Book = require('../models/book');

exports.getBooks = function(request, response) {
  Book.find((error, books) => {
    if (error)
      response.status(500).json({ message: 'Error getting all books'});
    response.json(books);
  });
}

exports.getBookById = function(request, response) {
  Book.findOne({ publicId: request.params.uid }, (error, book) => {
    if (error)
      return response.status(500).json({ message: 'Error getting book by ID'});
    response.json(book);
  });
}

exports.getBooksByCreator = function(request, response) {
  Book.find({ creator: request.params.uid }).lean().exec((error, books) => {
    if (error)
      return response.status(500).json({ message: 'Error getting all books by creator Id'});
    else if (books.length === 0)
      return response.status(404).json(null);
    response.json(books);
  });
}

exports.postBook = function(request, response) {
  const book = new Book({
    publicId: uuid.v1(),
    dateCreated: new Date(),
    title: request.body.title,
    author: request.body.author,
    creator: request.user.publicId,
  });

  book.save((error) => {
    if (error)
      response.status(500).json({ message: 'Error creating new book'});
    response.json(book);
  });
}
