const express = require('express');
const { getProfile, updateProfile } = require('../profileController');
const authMiddleware = require('../authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);

module.exports = router;
