// const io = app.get("io");

import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ChatEventEnum, AvailableChatEvents } from "../enum/ChatEnum.js";


const initializeSocketIO = (io) => {
    
    io.on("connection", async (socket) => {
        const authToken = socket.handshake.auth?.token;

        if(!authToken){
            throw new ApiError(401, "Unauthorized handshake. Token missing");
        }

        const decodedToken = jwt.verify(authToken, "secretkey");

        const user = await User.findById(decodedToken?.sub).select(
            "-password"
        );

        if(!user){
            throw new ApiError(401, "Unauthorized handshake. Token missing");
        }

        socket.user = user;

        /* Create the room for a user */
        socket.join(user._id.toString());

        socket.emit(ChatEventEnum.CONNECTED_EVENT);

        console.log("User connected, userId: ", user._id.toString());

        socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
            console.log("user has disconnected. userId: " + socket.user?._id);
            if (socket.user?._id) {
              socket.leave(socket.user._id);
            }
        });
    });
}

export { initializeSocketIO };

  