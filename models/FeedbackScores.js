// models/ScoresModel.js
import mongoose from "mongoose";

const ScoresSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming a User model exists
    },
    vocabularyScore: {
      type: Number,
      required: true,
    },
    coherenceScore: {
      type: Number,
      required: true,
    },
    fluencyScore: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Scores", ScoresSchema);
