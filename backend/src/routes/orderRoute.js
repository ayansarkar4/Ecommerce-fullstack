import { Router } from "express";

import {
  placeOrderCOD,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
} from "../controller/orderController.js";
import adminAuth from "../middlewares/adminAuth.js";
import authUser from "../middlewares/auth.js";

const router = Router();

//admin features
router.post("/list", adminAuth, allOrders);
router.post("/status", adminAuth, updateStatus);

//payment features

router.post("/cod", authUser, placeOrderCOD);
router.post("/stripe", authUser, placeOrderStripe);

//user features
router.post("/orders", authUser, userOrders);

//verify payment
router.post("/verifyStripe", authUser, verifyStripe);

export default router;
