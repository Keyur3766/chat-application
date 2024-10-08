import express from "express";
import connectDB from "./api/db/index.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser'
import loginRoutes from "./api/routes/login.routes.js"
const app = express()

dotenv.config({
    path: "./.env",
});

const startServer = () => {
    // set port, listen for requests
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });

    app.use(cors());
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.use("/api/login/", loginRoutes);
}


connectDB()
.then(() => {
    startServer();
})
.catch((err) => {
    console.log("failed to connect MongoDB", err);
});

