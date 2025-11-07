import jwt from "jsonwebtoken";
import user from "../models/user.js";
// middleware is a funcn that is executed before the controller functions

// in this middleware funcn we are protecting our routes : - that means if the user is authenticated then only user can access api endpoints

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userData = await user.findById(decoded.userId).select("-password");

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    req.user = userData;
    next();
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
