const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book');
const readingController = require('../controllers/reading');
const authController = require('../controllers/auth');

// GET All books
router.get('/all', authController.isAuthenticated, bookController.getBooks);

// GET Book by ID
router.get('/:uid', bookController.getBookById);

// GET Books by creator
router.get('/createdBy/:uid', bookController.getBooksByCreator);

// GET Users by currently reading
router.get('/:uid/currentReaders', readingController.getUsersByCurrentlyReading);

// POST New book
router.post('/', authController.isAuthenticated, bookController.postBook);

module.exports = router;
