import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, sendMessages } from "../controllers/message.controller.js";

const router = Router();

router.use(verifyJWT);


router.route("/:chatId")
    .get(getMessages)
    .post(sendMessages);

export default router;