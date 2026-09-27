import express from "express";

import {
    createPayment,
    processPayment
} from "../controllers/paymentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createPayment
);

router.post(
    "/process",
    authMiddleware,
    processPayment
);

export default router;