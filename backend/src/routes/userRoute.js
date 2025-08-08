import { Router } from "express";

import {
  registerUser,
  loginUser,
  adminLogin,
} from "../controller/userController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin", adminLogin);

export default router;
