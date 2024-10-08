import { Router } from "express";
import { registerUser, loginAndGenerateToken } from "../controllers/user.controller.js";

const router = Router();


router.route("/registeruser").post(registerUser);

router.route("/generateToken").post(loginAndGenerateToken);




export default router;