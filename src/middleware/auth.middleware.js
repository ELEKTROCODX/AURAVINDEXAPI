import jwt from 'jsonwebtoken';
import { app_config } from '../config/app.config.js';

export const auth_middleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, app_config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if(error.name == 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' });
    }
    res.status(401).json({ message: 'Invalid token.' });
  }
};
