import mongoose, { Schema } from "mongoose";

const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'ChatMessage'
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });
export const Chat = mongoose.model('chat', chatSchema);