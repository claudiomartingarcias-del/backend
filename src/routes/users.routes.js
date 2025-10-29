const express = require('express');
const router = express.Router();
const { listUsers, getUser } = require('../controllers/users.controller');
const { authMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, listUsers);
router.get('/:id', authMiddleware, getUser);

module.exports = router;