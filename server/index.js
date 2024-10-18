import express from "express";
import connectDB from "./api/db/index.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser'
import loginRoutes from "./api/routes/login.routes.js"
import chatRoutes from "./api/routes/chat.routes.js"
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocketIO } from "./api/socket/index.js";
const app = express()

dotenv.config({
    path: "./.env",
});

const startServer = () => {
    // set port, listen for requests
    const PORT = process.env.PORT || 8080;

    const httpServer = createServer(app);
    const io = new Server(httpServer, { pingTimeout: 60000,
        cors: {
          origin: process.env.CORS_ORIGIN,
          credentials: true,
    },});


    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });

    app.use(cors());
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.use("/api/login/", loginRoutes);
    app.use("/api/chat/", chatRoutes);

    app.set("io", io);

    initializeSocketIO(io);
}


connectDB()
.then(() => {
    startServer();
})
.catch((err) => {
    console.log("failed to connect MongoDB", err);
});

