import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import User from "./models/UserModel.js";

import { connectDB } from "./config/db.js";
import learningRoutes from "./routes/learningRoutes.js";
import userRoutes from "./routes/users.js";
import FeedbackRoute from "./routes/FeedbackRoute.js";
// import progressRoutes from './routes/progressRoutes.js'; 
import axios from "axios";
import FormData from "form-data";
import { saveFeedback } from "./controllers/feedbackController.js";
import authRoutes from "./routes/AuthRoute.js"; // This will handle auth routes for login, signup, etc.
import { sendVerificationEmail } from "./util/nodemailerConfig.js"; // Make sure to create this file
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import feedbackScores from "./routes/FeedbackScoresRoute.js";

import totalSpeech from "./routes/FeedbackScoresRoute.js";
import scoreRoutes from "./routes/scoreRoutes.js";

dotenv.config();

const app = express();

// CORS options
const corsOptions = {
  origin: "*", // Allow your frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable cookies to be sent with requests
};

// Apply middleware
app.use(cors(corsOptions)); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

const { MONGO_URL, PORT, JWT_SECRET, EMAIL_USER, EMAIL_PASS } = process.env;

// Connect to MongoDB
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

// app.post("/api/users", async (req, res) => {
//   try {
//     const { email, username, password } = req.body;
//     const user = new User({ email, username, password });
//     await user.save();
//     res.status(201).json({ message: "User created successfully", user });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "user CREATION error", error: error.message });
//   }
// });

// Start the server

// Routes
app.use(express.json());
app.use('/api/scores', scoreRoutes);

app.use("/api/learning", learningRoutes);
app.use("/api/users", userRoutes);

app.use("/api/learning", learningRoutes);
app.use("/api/", authRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}. Access it at http://localhost:${PORT}`
  );
});

//This is for speech to text feature:-
//temporarily pasted here for testing

app.use(
  cors({
    origin: "*", // Allow all origins (adjust for production use)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/feedback", FeedbackRoute);
app.use("/api/feedbackScores", feedbackScores);

app.use("/api/totalSpeech", totalSpeech);

app.get("/api/data", (req, res) => {
  res.json({ message: "CORS is working!" });
});

app.get("/", (req, res) => {
  res.json({ message: "server is working!" });
});
