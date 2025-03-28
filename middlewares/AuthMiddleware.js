
import User from "../models/UserModel.js"; 
import jwt from "jsonwebtoken"; 
import dotenv from "dotenv"; 
dotenv.config();

const userVerification = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ status: "User token expired" });
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET); 

    // Find the user associated with the decoded token
    const user = await User.findById(decodedToken.id);
    if (user) {
      req.user = user; 
      next(); 
    } else {
      return res.status(401).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export default userVerification;
