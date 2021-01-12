// MAIN ROUTER
const { validate } = require('./middleware.js');

// DEPENDENCIES
const router = require('express').Router();

// MIDDLEWARE
router.use('/authorize', require('./auth'));
router.use('/profile', validate, require('./profile'));


module.exports = router;
