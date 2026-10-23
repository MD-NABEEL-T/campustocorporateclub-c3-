import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found or deactivated' });
      }

      if (req.user.role !== 'admin' && !req.user.isApproved) {
        return res.status(403).json({
          message: 'Account pending admin approval or approval has been revoked',
          isPendingApproval: true,
        });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};

export const staffOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'coordinator')) {
    next();
  } else {
    res.status(403).json({ message: 'Staff access only (Admin or Coordinator)' });
  }
};

export const isOwnerUser = (user) => {
  const ownerEmail = (process.env.OWNER_EMAIL || '').trim().toLowerCase();
  if (!ownerEmail || !user) return false;
  return user.role === 'admin' && (user.email || '').trim().toLowerCase() === ownerEmail;
};

export const ownerOnly = (req, res, next) => {
  const ownerEmail = (process.env.OWNER_EMAIL || '').trim().toLowerCase();
  if (!ownerEmail) {
    return res.status(403).json({ message: 'Owner action forbidden: OWNER_EMAIL is not configured' });
  }
  if (req.user && isOwnerUser(req.user)) {
    next();
  } else {
    res.status(403).json({ message: 'Owner access only' });
  }
};