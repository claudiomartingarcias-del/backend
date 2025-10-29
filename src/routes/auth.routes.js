const express = require('express');
const router = express.Router();
const { register, me } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth');

router.post('/register', register);
router.get('/me', authMiddleware, me);

module.exports = router;