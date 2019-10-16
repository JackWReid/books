import express from 'express';
const router = express.Router();
import authenticate from '../auth/passport';
import { loginRedirect } from '../auth/helpers';
import { searchUsers } from '../controllers/search';
import { getUserCollections } from '../controllers/collection';
import { getMe, createUser, updateUser, getUser } from '../controllers/user';
import { followUser, unfollowUser, getUserFollowing, getUserFollowers } from '../controllers/relations';
import { getUserRegisteredBooks, getUserStartedBooks, getUserCurrentlyReading } from '../controllers/reading';
import { getReviewsByUser } from '../controllers/review';

router.get('/', authenticate, getMe);
router.patch('/', authenticate, updateUser);
router.post('/', loginRedirect, createUser);
router.get('/search/', searchUsers);
router.post('/follow/:id', authenticate, followUser);
router.delete('/follow/:id', authenticate, unfollowUser);
router.get('/:id/following', getUserFollowing);
router.get('/:id/followers', getUserFollowers);
router.get('/:id', getUser);
router.get('/:id/collections', getUserCollections);
router.get('/:id/reading', getUserCurrentlyReading);
router.get('/:id/finished_books', getUserStartedBooks);
router.get('/:id/registered_books', getUserRegisteredBooks);
router.get('/:id/reviews', getReviewsByUser);

export default router;
