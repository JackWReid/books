const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true,
    unique: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Book', BookSchema);
