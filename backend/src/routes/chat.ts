import { Router } from 'express';
import { 
  streamChat, 
  getChatHistory, 
  deleteChat 
} from '@/controllers/chat-controller';
import { authenticateToken } from '@/middleware/auth';
import { chatRateLimiter } from '@/middleware/rate-limit';

const router = Router();

// Apply authentication middleware to all chat routes
// router.use(authenticateToken);

// POST /api/chat/stream
router.post('/', chatRateLimiter, streamChat);

// GET /api/chat/history
router.get('/history', getChatHistory);

// DELETE /api/chat/:id
router.delete('/:id', deleteChat);

export default router; 