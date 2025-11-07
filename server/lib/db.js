import mongoose from "mongoose";

// function to connect to mongoose database

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database connected")
    );
    await mongoose.connect(`${process.env.MongoDB_URI}/chat-app`);
  } catch (error) {
    console.log(error);
  }
};
