
//Working Code
import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const CompletedChapterSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: function() {
      return this.isGoogleUser !== true; // Make it required only if not signing in with Google
    },
  },
  password: {
    type: String,
    required: function() {
      return this.isGoogleUser !== true; // Make it required only if not signing in with Google
    },
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  verified: {
    type: Boolean,
    default: false, 
  },
  token: String, 
  resetPasswordExpires: Date, 
  completedChapters: [CompletedChapterSchema],  // Store completed chapters
  isGoogleUser: {
    type: Boolean,
    default: false,  // Default to false; set it to true for Google users
  }
});

// Hash the password only if it has been modified (or is new)
userSchema.pre("save", async function (next) {
  if (this.isGoogleUser || !this.isModified("password")) {
    return next();
  }
  try {
    const hashedPassword = bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// This method compares the entered password with the stored hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {

  if (this.isGoogleUser) {
    return true; // If user is a Google user, password comparison is not necessary
  }

  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);  // Compare entered password with hashed one
    return isMatch;  // Returns true if the passwords match, false otherwise
  } catch (error) {
    console.error('Error in comparing password:', error); 
    throw new Error('Password comparison failed');  
  }
};

// Export the model
export default mongoose.model("User", userSchema);
