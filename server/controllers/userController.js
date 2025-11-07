import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import user from "../models/user.js";
import bcrypt from "bcryptjs";
// user signup function

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    // if any of the following field is missing (null)
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // if user already exist
    if (await user.findOne({ email })) {
      return res.json({ success: false, message: "Account already exist" });
    }
    // we store password in the encrypted form in our database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating a new user
    const newUser = await user.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    // token for user authentication
    const token = generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// login function

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check email exist or not
    const userData = await user.findOne({ email });
    // is the password correct

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    // if not correct
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData._id);

    res.json({ success: true, userData, token, message: "Login successfull" });
  } catch (error) {
    console.log(error.message);
    res.send({ success: false, message: error.message });
  }
};

// function to check if user is authenticated or not

export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// function to update user profile details

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id; // we add in body by protectRoute middleware

    let updatedUser;
    if (!profilePic) {
      updatedUser = await user.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await user.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// function to send message to selected user

export const sendMessage = async (req, res) => {
  try {
    
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
