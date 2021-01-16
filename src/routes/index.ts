// MAIN ROUTER
import { validate } from './middleware';
import { Router } from 'express';

// DEPENDENCIES
const router = Router();

// MIDDLEWARE
router.use('/swipe', validate, require('./swipe'));
router.use('/authorize', require('./auth'));
router.use('/profile', validate, require('./profile'));
router.use('/chat', validate, require('./chat'));


export default router;
