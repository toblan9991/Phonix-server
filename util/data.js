// util/data.js
import mongoose from 'mongoose';
import LearningModule from '../models/LearningModule.js';

// Manually extracted video URLs for each module
const fluencyVideos = [
  'https://www.youtube.com/watch?v=lHJ2w3KFpk4&list=PLfSUFKdFlttlrDw2756XyiZXrjdTOw9UH',
  'https://www.youtube.com/watch?v=y9mRTos12Sw&list=PLfSUFKdFlttlrDw2756XyiZXrjdTOw9UH&index=3',
  'https://www.youtube.com/watch?v=GWtwLv9jajE&list=PLfSUFKdFlttlrDw2756XyiZXrjdTOw9UH&index=4'
];

const vocabularyVideos = [
  'https://www.youtube.com/watch?v=OvvjJ_dJMms&list=PLD_5T89Ssbn3nMtDBXI_iR2uw6EZ5WW8Z',
  'https://www.youtube.com/watch?v=rrztIQ0F2-M&list=PLD_5T89Ssbn3nMtDBXI_iR2uw6EZ5WW8Z&index=7',
  'https://www.youtube.com/watch?v=IHcGSJlJeZk&list=PLD_5T89Ssbn3nMtDBXI_iR2uw6EZ5WW8Z&index=8'
];

const coherenceVideos = [
  'https://www.youtube.com/watch?v=P8Xm0U2U6SY&list=PLD_5T89Ssbn0FbigKmfNXTbQ-bRnWzI57',
  'https://www.youtube.com/watch?v=FfhZFRvmaVY&list=PLD_5T89Ssbn0FbigKmfNXTbQ-bRnWzI57&index=3',
  'https://www.youtube.com/watch?v=IHPSqN95XJk&list=PLD_5T89Ssbn0FbigKmfNXTbQ-bRnWzI57&index=4'
];


// Helper function to extract the YouTube video ID from the full URL
const extractVideoId = (url) => {
    const urlParams = new URL(url).searchParams;
    return urlParams.get('v'); // Extracts the video ID (after 'v=')
  };

// Helper function to create chapter objects from video URLs
const createChapters = (videoUrls, moduleTitle) => {
  return videoUrls.map((url, index) => ({
    chapterId: new mongoose.Types.ObjectId(),
    chapterTitle: `${moduleTitle} Chapter ${index + 1}`,
    chapterContent: url,
    videoId: extractVideoId(url),  // Extract and store the videoId
    requiredCoherence: 50,
    associatedChallenges: [`Challenge ${index + 1}`]
  }));
};

// Learning Modules
const learningModules = [
  {
    moduleId: new mongoose.Types.ObjectId(),
    moduleName: 'Fluency',
    chapters: createChapters(fluencyVideos, 'Fluency')
  },
  {
    moduleId: new mongoose.Types.ObjectId(),
    moduleName: 'Vocabulary',
    chapters: createChapters(vocabularyVideos, 'Vocabulary')
  },
  {
    moduleId: new mongoose.Types.ObjectId(),
    moduleName: 'Coherence',
    chapters: createChapters(coherenceVideos, 'Coherence')
  }
];

// Seed function to populate the database
export const seedLearningModules = async () => {
  try {
    await LearningModule.deleteMany();
    await LearningModule.insertMany(learningModules);
    console.log('Learning Modules Seeded');
  } catch (error) {
    console.error(error);
  }
};