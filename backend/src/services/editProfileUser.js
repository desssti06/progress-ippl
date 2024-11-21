import prisma from '../../prisma/prismaClient.js';
import bcrypt from 'bcrypt';
import firebaseAdmin from '../../firebase/firebaseAdmin.js';

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        userPhoto: true,
      },
    });
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

// Memperbarui nama pengguna
export const updateUserName = async (userId, name) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
    });
    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update name: ${error.message}`);
  }
};

// Memperbarui email pengguna
export const updateUserEmail = async (userId, email) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== userId) {
      throw new Error('Email is already in use by another user');
    }

    await firebaseAdmin.auth().updateUser(userId, { email });
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email },
    });

    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update email: ${error.message}`);
  }
};

// Memperbarui kata sandi pengguna
export const updateUserPassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await firebaseAdmin.auth().updateUser(userId, { password: newPassword });
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  } catch (error) {
    throw new Error(`Failed to update password: ${error.message}`);
  }
};

// Memperbarui foto profil pengguna
export const updateUserPhoto = async (userId, userPhotoUrl) => {
  try {
    console.log("Updating user photo for userId:", userId, "with URL:", userPhotoUrl);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { userPhoto: userPhotoUrl },
    });

    console.log("Database update successful. Updated user:", updatedUser);

    return updatedUser;
  } catch (error) {
    console.error('Error updating user photo in database:', error.message);
    throw new Error(`Failed to update photo: ${error.message}`);
  }
};