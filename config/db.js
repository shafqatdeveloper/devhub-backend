import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI_PUBLIC)
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
