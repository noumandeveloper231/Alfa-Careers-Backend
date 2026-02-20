import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI not set; skipping DB connect");
    return;
  }
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database Connected");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/rolemeld`);
  } catch (error) {
    console.error("DB connect error:", error);
  }
};

export default connectDB;