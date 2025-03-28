// routes/scoresRoutes.js
import express from "express";

import userVerification from "../middlewares/AuthMiddleware.js";

import {
  getFeedbackScores,
  totalSpeech,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.get("/getFeedbackScores", userVerification, getFeedbackScores);

router.get("/totalSpeech", userVerification, totalSpeech);

export default router;
