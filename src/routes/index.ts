// MAIN ROUTER
import { validate } from './middleware';
import { Router } from 'express';

// DEPENDENCIES
const router = Router();

// MIDDLEWARE
router.use('/authorize', require('./auth'));
router.use('/profile', validate, require('./profile'));

export default router;
