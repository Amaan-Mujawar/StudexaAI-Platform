import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MongoDB Error: MONGO_URI missing in environment");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
