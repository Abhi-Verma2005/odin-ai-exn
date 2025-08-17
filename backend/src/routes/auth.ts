import { Router } from 'express';
import { login } from '@/controllers/auth-controller';
import { authRateLimiter } from '@/middleware/rate-limit';

const router = Router();

// POST /api/auth/login
router.post('/login', authRateLimiter, login);

export default router; 