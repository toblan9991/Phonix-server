

import express from 'express';
import {
  getChapters,
  getChapterById,
  completeChapter,
  getChaptersByModuleId 
} from '../controllers/learningController.js';
import userVerification from '../middlewares/AuthMiddleware.js'; 

const router = express.Router();

// Route to get all chapters for a specific user
// router.get('/chapters/:userId', getChapters);
router.get('/chapters', userVerification, getChapters);

// Route to get all chapters for a specific moduleId
// router.get('/module/:moduleId', getChaptersByModuleId); 
router.get('/module/:moduleId', userVerification, getChaptersByModuleId);

// Route to get a specific chapter by chapterId
// router.get('/chapter/:chapterId', getChapterById);
router.get('/chapter/:chapterId', userVerification, getChapterById);

// Route to mark a chapter as complete for a specific user
// router.post('/complete/:userId/:moduleId/:chapterId', completeChapter);
router.post('/complete/:moduleId/:chapterId', userVerification, completeChapter);

export default router;