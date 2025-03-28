
// The code here is temporary and it was used for testing my learning feature backend configuration 
import mongoose from 'mongoose'; 
import User from '../models/UserModel.js';

// Create a new user using postman
export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = new User({
      userId: new mongoose.Types.ObjectId(),
      name,
      email,
      completedChapters: []
    });

    await user.save();
    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
