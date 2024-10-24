import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, sendMessages, getAllUnreadMessages } from "../controllers/message.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/getUnreadMessages")
    .get(getAllUnreadMessages);

router.route("/:chatId")
    .get(getMessages)
    .post(sendMessages);

export default router;