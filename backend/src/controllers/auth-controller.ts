import { Request, Response } from 'express';
import { z } from 'zod';
import { authenticateCredentials, generateToken } from '@/middleware/auth';
import { externalDb } from '@/config/database';
import { User } from '@/models/algo-schema';
import { eq } from 'drizzle-orm';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Authenticate user
    const user = await authenticateCredentials(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Update last login timestamp
    await externalDb
      .update(User)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(User.id, user.id));

    // Return success response
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username || ''
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 