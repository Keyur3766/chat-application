
import {User} from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registerUser = async(req,res) => {
    const  {username, email, password } = req.body;
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists", []);
    }
    const user = await User.create({
        username :username,
        email: email,
        password: password
    })
    
    await user.save();

    return res
    .status(200)
    .json(new ApiResponse(200, { isEmailVerified: true }, "Email is verified"));
  };


const loginAndGenerateToken = async(req,res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne(
          {
            username: username,
            password: password 
          }
        );

          if (user) {
              const token = jwt.sign({ sub: user._id, username: user.username }, process.env.SECRET_KEY, {
              expiresIn: "1h",
          });
          
          user.token = token;
          await user.save();
          res.cookie("jwtToken", token, {
            expires: new Date(Date.now()+1000000),
            httpOnly: true
          });
          // console.log("calling and working");
          res.status(200).json(new ApiResponse(200, { _id: user._id, token: token, username: user.username }, "Token generated.."));
        } else {
          res
            .status(400)
            .json(new ApiResponse(400, "Username or pasword is incorrect", "Username or password is incorrect"));
        }
    }
    catch(error){
        console.log(error);
        return error;
    }
};

const logOutAndRemoveToken = async(req,res) => {
  // remove cookie 
  await res.clearCookie('jwtToken');

  res.status(200).json(new ApiResponse(200, "", "Success"));
}

export{
  registerUser,
  loginAndGenerateToken,
  logOutAndRemoveToken
}