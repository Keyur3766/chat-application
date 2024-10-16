import { Router } from "express";
import { availableParticipants } from "../controllers/chat.controller.js";


const router = Router();

router.route("/availableParticipants").get(availableParticipants);


export default router;