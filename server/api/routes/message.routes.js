import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, sendMessages, getAllUnreadMessages, markMessageRead } from "../controllers/message.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/getUnreadMessages")
    .get(getAllUnreadMessages);

router.route("/markMessageRead/:messageId")
    .get(markMessageRead);

router.route("/:chatId")
    .get(getMessages)
    .post(sendMessages);

export default router;