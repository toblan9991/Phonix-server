import express from 'express';
const router = express.Router();
import { submitScore, getScoreHistory, getLevelProgress } from "../controllers/scoreController.js";

// Submit a score
router.post('/submit', submitScore);

// Get score history
router.get('/history', getScoreHistory);

// Get level progress
router.get('/progress', getLevelProgress);

export default router;