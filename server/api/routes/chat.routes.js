import { Router } from "express";
import { availableParticipants, addUserChat, getAllChats } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJWT);
router.route("/").get(getAllChats);
router.route("/availableParticipants").get(availableParticipants);
router.route("/addChat/:receiverId").get(addUserChat);


export default router;