import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const availableParticipants = async(req, res) => {
    const result = await User.find().select({"email": 1, "username": 1, "_id": 1});

    return res.status(200)
        .json(new ApiResponse(200, result, "Participants fetched"));
}

export{
    availableParticipants
}