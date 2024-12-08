import jwt from 'jsonwebtoken';
import {jwtSecret} from '../config/secrets';

module.exports = (req: any , res: any, next: any) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'No token provided' });
  }
}
