import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getWorktimeByTestId(testId) {
  try {
    const test = await prisma.test.findUnique({
      where: {
        id: testId,
      },
      select: {
        worktime: true, // Mengambil worktime dari test
      },
    });

    if (!test) {
      throw new Error('Test not found');
    }

    // Mengambil waktu kerja dan mengonversinya
    let worktimeInSeconds;
    if (test.worktime < 60) {
      // Jika worktime kurang dari 60, anggap ini dalam menit
      worktimeInSeconds = test.worktime * 60; // Konversi menit ke detik
    } else {
      worktimeInSeconds = test.worktime; // Jika sudah dalam detik
    }

    const currentTimeInSeconds = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik
    const endTimeInSeconds = currentTimeInSeconds + worktimeInSeconds; // Waktu akhir

    // Hitung waktu yang tersisa
    const remainingTimeInSeconds = endTimeInSeconds - currentTimeInSeconds;

    if (remainingTimeInSeconds <= 0) {
      // Jika waktu telah habis
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    // Menghitung jam, menit, dan detik yang tersisa
    const hours = Math.floor(remainingTimeInSeconds / 3600);
    const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
    const seconds = remainingTimeInSeconds % 60;

    return { hours, minutes, seconds };
  } catch (error) {
    throw new Error(`Error fetching worktime: ${error.message}`);
  }
}