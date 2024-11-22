import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createTestService = async (newTest) => {
    try {
        return await prisma.test.create({
            data: {
                authorId: newTest.authorId,
                type: newTest.type,
                category: newTest.category,
                title: newTest.title,
                testDescription: newTest.testDescription,
            },
        });
    } catch (error) {
        console.error("Error saat membuat tes:", error);
        throw new Error('Gagal membuat tes');
    }
};

export const publishTestService = async (testId, updateData) => {
    try {
        const updatedTest = await prisma.test.update({
            where: { id: testId },
            data: {
                ...updateData,
                isPublished: true,
            },
        });
        return updatedTest;
    } catch (error) {
        if (error.code === 'P2025') {
            console.error('Gagal mempublish tes: Rekaman tidak ditemukan dengan ID', testId);
        } else {
            console.error('Kesalahan tidak terduga:', error);
        }
        throw error; 
    }
};

export const getAllTestsService = async () => {
    return await prisma.test.findMany({
        select: {
            title: true,
            similarity: true
        }
    });
};

export const getTestsByCategory = async (category) => {
    return await prisma.test.findMany({
        where: { category },
    });
};

export const getTestDetailsService = async (testId) => {
    try {
        const testDetails = await prisma.test.findUnique({
            where: { id: testId },
            select: {
                id: true,
                title: true,
                type: true,
                category: true,
                testDescription: true,
                authorId: true,
                isPublished: true,
                price: true,
                similarity: true,
            },
        });

        if (!testDetails) {
            throw new Error('Test not found');
        }

        return testDetails;
    } catch (error) {
        console.error('Error in getTestDetailsService:', error);
        throw error;
    }
};

export const getTestResult = async (resultId) => {
    try {
        const latestTestResult = await prisma.result.findUnique({
            where: { id: resultId },
            select: {
                score: true,
                user: {
                    select: { name: true },
                },
                test: {
                    select: {
                        id: true,
                        title: true,
                        multiplechoice: {
                            select: {
                                question: true,
                            },
                        },
                    },
                },
                detail_result: {
                    select: {
                        option: {
                            select: {
                                isCorrect: true,
                            },
                        },
                        status: true,
                    },
                },
            },
        });

        if (!latestTestResult) {
            throw new Error('Test result not found');
        }

        const correctAnswers = latestTestResult.detail_result.filter(
            (detail) => detail.status === "final" && detail.option.isCorrect === true
        ).length;

        const wrongAnswers = latestTestResult.detail_result.filter(
            (detail) => detail.status === "final" && detail.option.isCorrect === false
        ).length;

        return {
            score: latestTestResult.score,
            userName: latestTestResult.user.name,
            testId: latestTestResult.test.id,
            testTitle: latestTestResult.test.title,
            correctAnswers,
            wrongAnswers,
        };
    } catch (error) {
        console.error('Error fetching test result:', error);
        throw new Error('Failed to fetch test result');
    }
};

export const getTestService = async (testId) => {
    return await prisma.test.findUnique({
        where: { id: testId },
        include: {
            author: true,
            multiplechoice: {
                include: {
                    option: true,
                },
            },
        },
    });
};

export const getAuthorTestsService = async (userId) => {
    try {
        const author = await prisma.author.findFirst({
            where: { userId: userId },
        });

        if (!author) {
            throw new Error('Author not found for this user');
        }

        const tests = await prisma.test.findMany({
            where: { authorId: author.id },
            select: {
                id: true,
                title: true,
                category: true,
                similarity: true,
                isPublished: true,
                price: true,
                _count: {
                    select: { history: true },
                },
                author: {
                    select: {
                        name: true,
                        authorPhoto: true,
                    },
                },
            },
        });

        return tests.map(test => ({
            id: test.id,
            judul: test.title,
            kategori: test.category,
            prediksi_kemiripan: `Prediksi kemiripan ${test.similarity}%`,
            history: test._count.history,
            author: test.author.name,
            isPublished: test.isPublished,
            price: test.price,
            authorProfile: test.author.authorPhoto,
        }));
    } catch (error) {
        console.error('Error in getAuthorTestsService:', error);
        throw error;
    }
};
