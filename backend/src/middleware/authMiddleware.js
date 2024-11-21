import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Ambil token dari header

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = { id: decodedToken.id }; // Simpan userId ke req.user
    next(); // Lanjutkan ke middleware atau controller berikutnya
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};