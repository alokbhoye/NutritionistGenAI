// backend/middleware/auth.js
import { getAuth } from '@clerk/clerk-sdk-node';

export function userAuthMiddleware(req, res, next) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  req.userId = userId;
  next();
}
