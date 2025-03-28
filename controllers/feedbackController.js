import Feedback from "../models/FeedbackModel.js";
import Scores from "../models/FeedbackScores.js";


import User from "../models/UserModel.js";
import mongoose from "mongoose";

// Controller function to save feedback and extract scores
export const saveFeedback = async (req, res) => {
  const { chatbotResponse } = req.body;
  const userId = req.user._id;


  // Validate chatbotResponse
  if (
    !chatbotResponse ||
    typeof chatbotResponse !== "string" ||
    chatbotResponse.trim() === ""
  ) {
    return res
      .status(400)
      .json({ error: "Chatbot response is required and cannot be empty." });
  }
  if (!userId) {
    return res.status(401).json({ error: "User not authenticated." });
  }

  try {
    // Extract scores from the chatbot response
    const scores = extractScores(chatbotResponse);

    // Save feedback to the database
    const newFeedback = new Feedback({
      feedbackText: chatbotResponse,
      userId: userId,
    });
    await newFeedback.save();

    // Save scores in the Scores collection


    if (
      scores.Vocabulary != null &&
      scores.Coherence != null &&
      scores.Fluency != null
    ) {
      const newScores = new Scores({
        userId,
        vocabularyScore: scores.Vocabulary,
        coherenceScore: scores.Coherence,
        fluencyScore: scores.Fluency,
      });
      await newScores.save();
    }

    // Respond with success message and scores
    res.status(201).json({
      message: "Chatbot response and scores saved successfully!",
      scores: scores,
    });
    console.log(scores);
  } catch (error) {
    console.error("Error saving feedback and scores:", error);
    res.status(500).json({ error: "Failed to save feedback and scores." });
  }
};


/// Enhanced Helper Function to Extract Scores
const extractScores = (responseText) => {
  console.log("Response text received:", responseText);

  // Flexible regex patterns for "Points" or "**XX%**" formats
  const vocabRegex = /Vocabulary.*?\*?\*?(\d+)%/i;
  const coherenceRegex = /Coherence.*?\*?\*?(\d+)%/i;
  const fluencyRegex = /Fluency.*?\*?\*?(\d+)%/i;

  // Match scores in the response
  const vocabMatch = responseText.match(vocabRegex);
  const coherenceMatch = responseText.match(coherenceRegex);
  const fluencyMatch = responseText.match(fluencyRegex);

  console.log("Vocabulary match:", vocabMatch);
  console.log("Coherence match:", coherenceMatch);
  console.log("Fluency match:", fluencyMatch);


  // Parse matches into integers or return null
  const scores = {
    Vocabulary: vocabMatch ? parseInt(vocabMatch[1], 10) : null,
    Coherence: coherenceMatch ? parseInt(coherenceMatch[1], 10) : null,
    Fluency: fluencyMatch ? parseInt(fluencyMatch[1], 10) : null,
  };

  console.log("Extracted scores:", scores);
  return scores;
};

// Controller function to retrieve feedback scores for a user
export const getFeedbackScores = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is available via middleware

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated." });
  }

  try {
    // Fetch all scores documents for the user
    const scoresList = await Scores.find({ userId: userId });


    // Fetch user details (Assuming you have a User model)
    const user = await User.findById(userId);
    const userName = user.username; // Replace with your user schema's name field

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ userName, scores: scoresList });
  } catch (error) {
    console.error("Error retrieving feedback scores:", error);
    res.status(500).json({ error: "Failed to retrieve feedback scores." });
  }
};

export const totalSpeech = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is available via middleware

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated." });
  }

  try {
    // Fetch all scores documents for the user
    const scoresList = await Scores.find({ userId: userId });


    res.status(200).json({ scores: scoresList });
  } catch (error) {
    console.error("Error retrieving feedback scores:", error);
    res.status(500).json({ error: "Failed to retrieve feedback scores." });
  }
};
