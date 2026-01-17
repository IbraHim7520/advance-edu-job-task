import mongoose from "mongoose"
import envConfig from "./envConfig.js"
const connectDatabase = async() =>{
    try {
        await mongoose.connect(envConfig.db_uri)
        console.log("Connected to Mongodb.");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

export default connectDatabase;