import express from "express";

import productValidator from "../validators/productValidator.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
    getProducts,
    getProduct,
    deleteProduct,
    putProduct,
    postProduct
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", authMiddleware, getProducts);

router.get("/:id", authMiddleware, getProduct);

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    productValidator,
    postProduct
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    productValidator,
    putProduct
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);

export default router;