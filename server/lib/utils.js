import jwt from "jsonwebtoken";

// function to generate token for user authentication

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
};
