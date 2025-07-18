import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ambil data user dari DB berdasarkan ID di token dan lampirkan ke request
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).send({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    res.status(401).send({ message: 'Not authorized, no token' });
  }
});

// Middleware baru untuk Admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
};

// Middleware untuk memastikan role adalah 'student'
const studentOnly = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).send({ message: 'Not authorized, students only resource' });
  }
};

// Middleware untuk memastikan role adalah 'teacher'
const teacherOnly = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    next();
  } else {
    res.status(403).send({ message: 'Not authorized as a teacher' });
  }
};

// Middleware untuk memastikan role adalah 'parent' atau 'teacher' + 'admin'
const parentOrTeacher = (req, res, next) => {
  const allowedRoles = ['parent', 'teacher', 'admin'];
    if (allowedRoles.includes(req.user.role)) {
        next();
    } else {
        res.status(403).send({ message: 'Not authorized as a parent or teacher' });
    }
};

// Middleware untuk memastikan role adalah 'admin' atau 'teacher'
const adminOrTeacher = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'teacher')) {
        next();
    } else {
        res.status(403).send({ message: 'Not authorized as a admin or teacher' });
    }
};

export { protect, studentOnly, teacherOnly, adminOnly, adminOrTeacher, parentOrTeacher };
