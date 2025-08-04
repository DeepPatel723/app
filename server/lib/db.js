import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            dbName:"app"
        }).then(()=>{console.log("DataBase connect Successfully!!")})
    } catch (error) {
        console.error("Error Connecting to DataBase:", error);
        process.exit(1);
    }
}

export default connectDB;

