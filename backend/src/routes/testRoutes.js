import express from 'express';
import { createTest, getTest, testResultController, createTestController, publishTestController, getAllTests, fetchTestsByCategory, getAuthorTests } from '../controllers/testControllers.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; 


const router = express.Router();

router.post('/create-test', createTest);
router.get('/get-test/:id', getTest);
router.get('/test-result/:resultId', testResultController);

router.post('/tests', createTestController);

router.put('/tests/:testId/publish', publishTestController);

router.get('/category/:category', fetchTestsByCategory);

router.get('/get-test', getAllTests);
router.get('/author-tests', authenticateToken, getAuthorTests);


export default router; // Menggunakan default export



// const express = require("express");
// const { createTest } = require("backend/src/controllers/testControllers.js");

// const router = express.Router();

// router.post("/create-test", createTest);

// module.exports = router;