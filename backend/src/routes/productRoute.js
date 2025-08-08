import { Router } from "express";
import {
  addProduct,
  listProduct,
  removeProduct,
  singleProduct,
} from "../controller/productController.js";
import { upload } from "../middlewares/multerMiddleWare.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = Router();

router.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
router.get("/list", listProduct);
router.delete("/remove/:id", adminAuth, removeProduct);
router.post("/single/:id", singleProduct);

export default router;
