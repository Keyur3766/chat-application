import mongoose, { Schema } from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'chat'
    }
});

export const ChatMessage = mongoose.model('chatMessage', ChatMessageSchema);