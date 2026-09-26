import { Router } from 'express';
import { getRouteAdvice } from './ai.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

// Route advice is protected by auth middleware
router.post('/route-advice', authenticateToken, getRouteAdvice);

export default router;
