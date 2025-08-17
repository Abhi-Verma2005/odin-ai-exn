import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username?: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'dev-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as any;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
};

export const authenticateCredentials = async (
  email: string,
  password: string
): Promise<any> => {
  try {
    // Mock user for development - in production this would query the database
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      password: await bcrypt.hash('password123', 10)
    };

    // For now, accept any email/password combination for development
    if (email && password) {
      return mockUser;
    }

    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

export const generateToken = (user: any): string => {
  const jwtSecret = process.env.JWT_SECRET || 'dev-secret-key';
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    username: user.username || '',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
  };

  return jwt.sign(tokenPayload, jwtSecret, {
    algorithm: 'HS256'
  });
}; 