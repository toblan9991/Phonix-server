import express from 'express';
import { completeChapter } from '../controllers/learningController.js';
import { createUser } from '../controllers/userController.js'; 



const router = express.Router();

// Mark a chapter as completed by user
router.post('/complete/:userId/:moduleId/:chapterId', completeChapter);
router.post('/', createUser); 
// POST /api/users

export default router;