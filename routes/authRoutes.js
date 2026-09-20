const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');
const { authRateLimiter } = require('../middleware/rateLimiter');
const { validate, registerRules, loginRules } = require('../middleware/validate');

// Rate limiter diterapkan ke kedua endpoint auth
router.post('/register', authRateLimiter, validate(registerRules), registerUser);
router.post('/login', authRateLimiter, validate(loginRules), loginUser);

module.exports = router;