const express = require('express');
const router = express.Router();
const { listMatches, createMatch } = require('../controllers/matches.controller');
const { authMiddleware } = require('../middlewares/auth');

router.get('/', listMatches);
router.post('/', authMiddleware, createMatch);

module.exports = router;