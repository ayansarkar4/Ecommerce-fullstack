import { Router } from "express";
import authUser from "../middlewares/auth.js";

import {
  addToCart,
  updateCart,
  getUserCart,
} from "../controller/cartController.js";

const router = Router();

router.post("/add", authUser, addToCart);
router.post("/update", authUser, updateCart);
router.get("/get", authUser, getUserCart);

export default router;
