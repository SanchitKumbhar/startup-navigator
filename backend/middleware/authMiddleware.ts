import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken } from '../auth/jwt';

export interface AuthRequest extends Request {
  auth?: {
    userId: string;
    email: string;
  };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  req.auth = {
    userId: payload.userId,
    email: payload.email,
  };

  next();
}
