import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env

import { seedLearningModules } from './util/data.js';
import { connectDB } from './config/db.js';

const seed = async () => {
  try {
    await connectDB();
    await seedLearningModules();
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();