import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const hashPassword = async (password: string) => {
  return bcryptjs.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  return bcryptjs.compare(password, hashedPassword);
};

export const generateToken = (employeeId: string, email: string) => {
  return jwt.sign({ employeeId, email }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
