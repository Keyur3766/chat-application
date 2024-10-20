import { Router } from "express";
import { availableParticipants } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJWT);
router.route("/availableParticipants").get(availableParticipants);


export default router;