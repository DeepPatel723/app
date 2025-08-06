import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import passport from "passport";
import "./lib/passport.js";
import session from "express-session";
import cors from "cors";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, 
}));

app.use(session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // Use a strong secret in production!
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth", authRoutes);

app.listen(PORT,()=>{
    console.log(`Server Started on port:${PORT}`);
})