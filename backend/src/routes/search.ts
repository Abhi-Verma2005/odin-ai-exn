import { Router } from 'express';
import { searchWeb } from '@/controllers/search-controller';
import { generalRateLimiter } from '@/middleware/rate-limit';

const router = Router();

// POST /api/search
router.post('/', generalRateLimiter, searchWeb);

export default router; 