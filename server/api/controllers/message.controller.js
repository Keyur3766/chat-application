import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.models.js";
import { ChatMessage } from "../models/messages.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

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

  res
    .status(200)
    .json(
      new ApiResponse(200, messages || [], "messages retrieved successfully")
    );
});

export { getMessages };
