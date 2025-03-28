//models/LearningModule.js
import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  chapterTitle: {
    type: String,
    required: true
  },
  chapterContent: {
    type: String, // URL to video lesson
    required: true
  },
  requiredCoherence: {
    type: Number,
    default: 0
  },
  associatedChallenges: {
    type: [String],
    default: []
  }
});

const LearningModuleSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  moduleName: {
    type: String,
    enum: ['Fluency', 'Vocabulary', 'Coherence'],
    required: true
  },
  chapters: [ChapterSchema]
});

const LearningModule = mongoose.model('LearningModule', LearningModuleSchema);
export default LearningModule;