import prisma from '../../prisma/prismaClient.js'; // Pastikan ini benar
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginAdminServices = async ({ email, password }) => {
  const admin = await prisma.user.findUnique({ where: { email } });

  if (!admin || admin.role !== 'ADMIN') {
      throw new Error('ADMIN_NOT_FOUND');
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
      throw new Error('INVALID_PASSWORD');
  }

  // Generate JWT token
  const token = jwt.sign(
      { id: admin.id, role: admin.role }, // Payload (data yang disimpan dalam token)
      process.env.JWT_SECRET, // Pastikan Anda sudah mendefinisikan JWT_SECRET di environment variables
      { expiresIn: '1h' } // Token expired dalam 1 jam, bisa disesuaikan
  );

  return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token, // Return token bersama data admin
  };
};

export const getDashboardStats = async () => {
  try {
    const totalUsers = await prisma.user.count({
      where: { role: 'USER' }
    });

    const totalAuthors = await prisma.author.count();

    const totalPublishedTests = await prisma.test.count({
      where: { 
        // Assuming there's a 'status' field for tests. Adjust if needed.
        isPublished: true
      }
    });

    return {
      totalUsers,
      totalAuthors,
      totalPublishedTests
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
};