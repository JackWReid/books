const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

// GET All users
router.get('/', userController.getUsers);

// GET authed user
router.get('/me', authController.isAuthenticated, userController.getMe);

// GET user by Id
router.get('/:uid', userController.getUserById);

// POST Create a new user
router.post('/', userController.postUser);

// POST Follow a user
router.post('/follow/:uid', authController.isAuthenticated, userController.followUser);

// DELETE Unfollow a user
router.delete('/follow/:uid', authController.isAuthenticated, userController.unfollowUser);

// PATCH Set user has onboarded
router.put('/onboarded', authController.isAuthenticated, userController.userOnboarded);

module.exports = router;
