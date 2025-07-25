import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.models.js";
import { ChatMessage } from "../models/messages.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { emitSocketIOEvent } from "../socket/index.js";
import { ChatEventEnum } from "../enum/ChatEnum.js";

const chatMessageCommonAggregation = () => {
  return [
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "sender",
        as: "sender",
        pipeline: [
          {
            $project: {
              username: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        sender: { $first: "$sender" },
      },
    },
  ];
};

const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const messages = await ChatMessage.aggregate([
    {
      $match: {
        chat: new mongoose.Types.ObjectId(chatId),
      },
    },
    ...chatMessageCommonAggregation(),
    {
      $sort: {
        createdAt: -1, 
      },
    },
  ]);

  const updatedUnreadMessages = await ChatMessage.updateMany(
    {
      $and: [
        {chat: new mongoose.Types.ObjectId(chatId)},
        {isReaded: false}
      ],
    }, 
    {
      $set: {
        isReaded: true
      }
    }, {new: true});

    if(updatedUnreadMessages){
      emitSocketIOEvent(req, req.user._id.toString(), ChatEventEnum.UPDATE_UNREAD_MESSAGE, chatId);
    }

    res
    .status(200)
    .json(
      new ApiResponse(200, messages || [], "messages retrieved successfully")
    );
});

const sendMessages = asyncHandler(async (req, res) => {
  // Get chatId from params and content from body
  const {chatId} = req.params;
  const {content} = req.body;

  // perform necessary checks for chatId
  if(!chatId || !content){
    throw new ApiError(400, "Message content or chatId not found");
  }
  const selectedChat = await Chat.findById(chatId);
  if(!selectedChat){
    throw new ApiError(400, "Chat doesn't exist");
  }

  // Create new chatMessage and push it to document
  const message = await ChatMessage.create({
    sender: new mongoose.Types.ObjectId(req.user._id),
    content: content,
    chat: new mongoose.Types.ObjectId(chatId)
  });

  // update the last message in chat document
  const updatedChat = await Chat.findByIdAndUpdate(chatId, {
    $set: {
      lastMessage: message._id
    }
  }, { new: true });
 
  // convert the format to commonMessage format
  const messages = await ChatMessage.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(message._id),
      },
    },
    ...chatMessageCommonAggregation(),
  ]);

  const receivedMessage = messages[0];
  if (!receivedMessage) {
    throw new ApiError(500, "Internal server error");
  }

  // Emit received event which parse the message format which we got above
  updatedChat.participants.forEach((participantId) => {
    if(participantId.toString()===req.user._id.toString()) return;
    
    emitSocketIOEvent
    (
      req,
      participantId.toString(), 
      ChatEventEnum.MESSAGE_RECEIVED_EVENT, 
      receivedMessage
    );
  })
  // send the response
  return res.status(201).json(
    new ApiResponse(201, receivedMessage, "Message sent successfully")
  );

});

const getAllUnreadMessages = asyncHandler(async (req, res) => {

  const chatmessages = await ChatMessage.aggregate([
    {
      $match: {
        isReaded: false
      }
    },
    {
      $lookup: {
        from: "chats",
        foreignField: "_id",
        localField: "chat",
        as: "chatContent",
        pipeline: [
          {
            $match: {
              participants: { $elemMatch: { $eq: req.user._id } }, // get all chats that have logged in user as a participant
            },
          }
        ]
      }
    },
    {
      $project: {
        chatContent: 0
      }
    },
    ...chatMessageCommonAggregation()
  ])

  res.status(200).json(new ApiResponse(200, chatmessages, "Unread messages fetched..."));
});

const markMessageRead = asyncHandler(async (req, res) => {
  const {messageId} = req.params;

  const updatedChat = await ChatMessage.findByIdAndUpdate(new mongoose.Types.ObjectId(messageId), {
    $set: {
      isReaded: true
    }
  }, { new: true });

  res.status(201).json(new ApiResponse(201, updatedChat, "message marked readed"));
})



export { getMessages, sendMessages, getAllUnreadMessages, markMessageRead };
