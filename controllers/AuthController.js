

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import { sendVerificationEmail } from '../util/nodemailerConfig.js';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

// Initialize the Google OAuth2 client with your Google Client ID
const client = new OAuth2Client(process.env.GOOGLE_IOS_CLIENT_ID);


export const Signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Hash the password (using bcryptjs with 10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = new User({
      email,
      username,
      password: hashedPassword, // Store hashed password
    });

    await newUser.save();

    // Respond with success (No token involved here, as you mentioned)
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user', message: error.message });
  }
};



export const Login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await user.comparePassword(req.body.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture || null,
          }
        });
    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const ForgetPassword = async (req, res) => {
    // Your logic for forget password
};

export const ResetPassword = async (req, res) => {
    // Your logic for reset password
};

export const VerifyAccount = async (req, res) => {
    const { token } = req.params;





    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.verified = true;  // Use the verified field you have in your model
        await user.save();

        res.status(200).json({ message: 'Email verified successfully.' });
    });
};


export const EditUser = async (req, res) => {
  const { id } = req.params;
  const { email, username, password } = req.body;

  try {
      // Check if ID is valid
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid user ID" });
      }

      // Find user by ID
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Update fields if they are provided
      if (email) user.email = email;
      if (username) user.username = username;
      if (password) user.password = await bcrypt.hash(password, 10); // Hash the password before saving
      user.updatedAt = new Date();

      await user.save();
      
      res.status(200).json({ message: "Admin details updated successfully", user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture || null,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const UpdateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const { id } = req.params;
    //const userId = req.user.id;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const updateData = { username, email };

    if (req.file) {
      const profilePicture = `/uploads/${req.file.filename}`;
      updateData.profilePicture = profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture || null,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const Google = async (req, res) => {
  try {
    const { idToken } = req.body;
    console.log('Received idToken:', idToken);

    // Verify the ID token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_IOS_CLIENT_ID, // Your Google client ID to validate the token
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;



    // Check if user already exists
    let user = await User.findOne({ email });
    console.log(user)

    if (!user) {
      // Create a new user if not found
      user = new User({
        email,
        username: name, 
        isGoogleUser: true, // Mark as a Google user
        verified: true, // Mark as verified since Google authenticated
      });
      await user.save();
      
      // return res.status(201).json({ message: 'User created successfully.' });
      return res.status(201).json({
        message: 'User created successfully.',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          picture: user.picture,  // Include other fields you need here, if any
        },
      });
    }

    // If user exists, log them in and generate a JWT token for the session
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Send the token and user info back to the client
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username, 
        picture: user.picture, 
      },
    });

  } catch (error) {
    console.error('Error during Google Sign-In:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }

}
