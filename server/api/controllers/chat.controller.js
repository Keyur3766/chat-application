import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.models.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitSocketIOEvent } from "../socket/index.js";
import { ChatEventEnum } from "../enum/ChatEnum.js";

const availableParticipants = async (req, res) => {
  const result = await User.find().select({ email: 1, username: 1, _id: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Participants fetched"));
};

/**
 * @description Utility function which returns the pipeline stages to structure the chat schema with common lookups
 * @returns {mongoose.PipelineStage[]}
 */
const chatCommonAggregation = () => {
  return [
    {
      // lookup for the participants present
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "participants",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        lastMessage: { $first: "$lastMessage" },
      },
    },
  ];
};

const addUserChat = asyncHandler(async (req, res) => {
  // Performing necessary checks
  const { receiverId } = req.params;
  const receiver = await User.findById(receiverId);
  console.log(receiverId);
  console.log(req.user._id);
  if (!receiver) {
    throw new ApiError(404, "Receiver doesn't exist");
  }
  if (receiver._id.toString() == req.user._id.toString()) {
    throw new ApiError(400, "You can't chat with your self");
  }
  // Create the new chat instance inside chat model
  const chat = await Chat.aggregate([
    {
      $match: {
        $and: [
          {
            participants: { $elemMatch: { $eq: req.user._id } },
          },
          {
            participants: {
              $elemMatch: { $eq: new mongoose.Types.ObjectId(receiverId) },
            }
          },
        ],
      },
    },
  ]);


  if (chat.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, chat[0], "Chat retrieved successful"));
  }

  const newChatInstance = await Chat.create({
    participants: [req.user._id, new mongoose.Types.ObjectId(receiverId)],
    admin: req.user._id,
  });

  const createdChat = await Chat.aggregate([
    {
      $match: {
        _id: newChatInstance._id,
      },
    },
    ...chatCommonAggregation(),
  ]);

  const payload = createdChat[0]; // store the aggregation result

  if (!payload) {
    throw new ApiError(500, "Internal server error");
  }

  // emit the event such that another user can detect that change
  payload.participants.forEach((participant)=> {
    if(participant._id.toString() === req.user._id.toString()) return;

    emitSocketIOEvent(req, participant._id?.toString(), ChatEventEnum.NEW_CHAT_EVENT, payload);
  })

  return res
    .status(201)
    .json(new ApiResponse(201, createdChat, "Chat retrieved successful"));
});


const getAllChats = asyncHandler(async (req, res) => {
  const chats = await Chat.aggregate([
    {
      $match: {
        participants: { $elemMatch: { $eq: req.user._id } }, // get all chats that have logged in user as a participant
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
    ...chatCommonAggregation(),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, chats || [], "User chats fetched successfully!")
    );
});

export { availableParticipants, addUserChat, getAllChats };
