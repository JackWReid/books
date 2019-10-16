import express from 'express';
const router = express.Router();
import authenticate from '../auth/passport';
import {
  createCollection,
  deleteCollection,
  addBookToCollection,
  removeBookFromCollection,
  getCollectionById,
  getCollectionBooks
} from '../controllers/collection';

router.post('/', authenticate, createCollection);
router.get('/:id', getCollectionById);
router.delete('/:id', authenticate, deleteCollection);
router.get('/:id/books', getCollectionBooks);
router.post('/:collection_id/add/:book_id', authenticate, addBookToCollection);
router.delete('/:collection_id/add/:book_id', authenticate, removeBookFromCollection);

export default router;
