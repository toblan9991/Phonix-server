// const express = require("express");
import express from "express";
const router = express.Router();
// const feedbackController = require("../controllers/feedbackController");
import { saveFeedback } from "../controllers/feedbackController.js";
import userVerification from "../middlewares/AuthMiddleware.js";

// POST route for saving chatbot response
router.post("/chatbotResponse", userVerification, saveFeedback);

// module.exports = router;
export default router;
