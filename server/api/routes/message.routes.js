import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages } from "../controllers/message.controller.js";

const router = Router();

router.use(verifyJWT);


router.route("/:chatId").get(getMessages)

export default router;