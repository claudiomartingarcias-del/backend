const express = require('express');
const router = express.Router();
const { listClubs } = require('../controllers/clubs.controller');

router.get('/', listClubs);

module.exports = router;