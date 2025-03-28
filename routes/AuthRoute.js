
import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import { OAuth2Client } from 'google-auth-library'; // Import the Google Auth library
import dotenv from 'dotenv';
import userVerification from '../middlewares/AuthMiddleware.js';
import { Signup, Login, ForgetPassword, ResetPassword, VerifyAccount , Google , EditUser, getUserProfile, UpdateUserProfile } from "../controllers/AuthController.js";


dotenv.config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Create a new OAuth2 client

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });

router.post('/auth/signup', Signup);
router.post('/auth/login', Login);
router.get('/auth/user', userVerification, getUserProfile);
router.put('/auth/user/:id', userVerification, upload.single('profilePicture'), UpdateUserProfile);
router.post('/auth/google', Google)

router.post('/forget-password', ForgetPassword);
router.post('/reset-password/:token', ResetPassword);
router.post('/verify/:token', VerifyAccount);
router.put('/auth/edit/:id', EditUser)




 export default router; 