// const io = app.get("io");

import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ChatEventEnum, AvailableChatEvents } from "../enum/ChatEnum.js";


/**
 * @description This function is responsible to allow user to join the chat represented by chatId (chatId). event happens when user switches between the chats
 * @param {Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} socket
 */
const mountJoinChatEvent = (socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`User joined the chat 🤝. chatId: `, chatId);
    // joining the room with the chatId will allow specific events to be fired where we don't bother about the users like typing events
    // E.g. When user types we don't want to emit that event to specific participant.
    // We want to just emit that to the chat where the typing is happening
    socket.join(chatId);
  });
};

const initializeSocketIO = (io) => {
  io.on("connection", async (socket) => {
    try {
      const authToken = socket.handshake.auth?.token;

      if (!authToken) {
        throw new ApiError(401, "Unauthorized handshake. Token missing");
      }

      const decodedToken = jwt.verify(authToken, "secretkey");

      const user = await User.findById(decodedToken?.sub).select("-password");

      if (!user) {
        throw new ApiError(401, "Unauthorized handshake. Token missing");
      }

      socket.user = user;

      /* Create the room for a user */
      socket.join(user._id.toString());

      socket.emit(ChatEventEnum.CONNECTED_EVENT);

      console.log("User connected, userId: ", user._id.toString());
      mountJoinChatEvent(socket);
      
      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log("user has disconnected. userId: " + socket.user?._id);
        if (socket.user?._id) {
          socket.leave(socket.user._id);
        }
      });
    } catch (error) {
        socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        error?.message || "Something went wrong while connecting to the socket."
    );
    }
  });
};

const emitSocketIOEvent = (req, roomId, event, payload) => {
  req.app.get("io").to(roomId).emit(event, payload);
}


export { initializeSocketIO, emitSocketIOEvent };
