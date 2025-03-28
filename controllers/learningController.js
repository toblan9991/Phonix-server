import User from '../models/UserModel.js';
import LearningModule from '../models/LearningModule.js';

// Get all chapters for a specific user based on feedback analysis
export const getChapters = async (req, res) => {
  try {
    const learningModules = await LearningModule.find();
    res.status(200).json(learningModules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific chapter by its ID
export const getChapterById = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const chapter = await LearningModule.findOne({ 'chapters.chapterId': chapterId }, { 'chapters.$': 1 });

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.status(200).json(chapter.chapters[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chapters by moduleId
export const getChaptersByModuleId = async (req, res) => {
  try {
    const { moduleId } = req.params;

    // Find the module by its ID and return all chapters within that module
    const module = await LearningModule.findOne({ moduleId });

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Return all chapters of the module
    res.status(200).json(module.chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a module chapter as completed for a user
export const completeChapter = async (req, res) => {
  try {
    // const { userId, moduleId, chapterId } = req.params;
    const userId = req.user._id;
    const { moduleId, chapterId } = req.params;

    // Fetch user by ID
    // const user = await User.findOne({ userId });
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the chapter is already marked as completed
    const isAlreadyCompleted = user.completedChapters.some(
      (chapter) => chapter.moduleId.equals(moduleId) && chapter.chapterId.equals(chapterId)
    );

    if (isAlreadyCompleted) {
      return res.status(400).json({ message: 'Chapter already completed' });
    }

    // Add the completed chapter to the user's record
    user.completedChapters.push({
      moduleId,
      chapterId,
      completedAt: new Date(),
    });

    // Save user data
    await user.save();

    res.status(200).json({ message: 'Chapter marked as completed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};