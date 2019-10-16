import express from 'express';
const router = express.Router();
import authenticate from '../auth/passport';
import { getFeed } from '../controllers/feed';

router.get('/', authenticate, getFeed);

export default router;
