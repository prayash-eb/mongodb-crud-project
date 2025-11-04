import { config } from "dotenv";
config()
import type { Application, Request, Response } from "express"
import express from "express";
import connectDB from "./config/database.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";

const PORT = process.env.PORT || 3000


const app: Application = express()
app.use(express.json())


app.use("/user", userRouter)
app.use("/product", productRouter)


app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({
        status: "OK",
        message: "Server is up",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

app.use((req, res) => {
    res.status(404).json({ message: "Route doesnot exist" })
})


app.listen(PORT, async () => {
    await connectDB()
    console.log(`Server listening on PORT:${PORT}`);
})