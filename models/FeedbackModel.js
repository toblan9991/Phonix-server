// const mongoose = require("mongoose");


const Schema = mongoose.Schema;
import mongoose from "mongoose";

const feedbackSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  feedbackId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  feedbackText: {
    type: String,
    required: true,
  },
  fudio: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Feedback", feedbackSchema);
