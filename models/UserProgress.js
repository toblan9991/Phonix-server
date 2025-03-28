import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challenge_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  current_level: {
    type: Number,
    required: true
  },
  attempt_details: {
    vocabulary: {
      score: Number,
      completed_at: Date,
      attempts: [{
        score: Number,
        date: Date
      }]
    },
    fluency: {
      writing_score: Number,
      speaking_score: Number,
      completed_at: Date,
      attempts: [{
        writing_score: Number,
        speaking_score: Number,
        date: Date
      }]
    },
    coherence: {
      score: Number,
      completed_at: Date,
      attempts: [{
        score: Number,
        date: Date
      }]
    }
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;