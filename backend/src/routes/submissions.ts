import { Router } from 'express';
import { submitCode } from '@/controllers/submission-controller';
import { authenticateToken } from '@/middleware/auth';
import { generalRateLimiter } from '@/middleware/rate-limit';

const router = Router();

// Apply authentication middleware to all submission routes
router.use(authenticateToken);

// POST /api/submissions/submit
router.post('/submit', generalRateLimiter, submitCode);

export default router; 