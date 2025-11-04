import mongoose from "mongoose";

export default async function connectDB() {
    try {
        const DB_URL = process.env.DATABASE_URL;
        if (!DB_URL) {
            console.log("Please configure database URL");
            process.exit(1)
        }
        mongoose.connection.on("connected", () => {
            console.log("Database Connected");
        })
        mongoose.connect(process.env.DATABASE_URL!,{
            dbName:"db_project"
        })
    } catch (error) {
        console.log("Error while connecting to database", error);
        process.exit(1)
    }
}