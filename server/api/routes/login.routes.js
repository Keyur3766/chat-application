import { Router } from "express";
import { registerUser, loginAndGenerateToken, logOutAndRemoveToken } from "../controllers/user.controller.js";

const router = Router();


router.route("/registeruser").post(registerUser);

router.route("/generateToken").post(loginAndGenerateToken);

router.route("/removeToken").post(logOutAndRemoveToken);




export default router;