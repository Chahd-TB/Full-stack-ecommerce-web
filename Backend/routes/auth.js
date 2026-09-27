import express from "express";

import {
    signup,
    login,
    makeAdmin,
    getUsers,
    makeUser,
    updateProfile,
    updatePassword
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);

router.put(
    "/profile",
    authMiddleware,
    updatePassword
);

router.patch(
    "/make-admin",
    authMiddleware,
    adminMiddleware,
    makeAdmin
);

router.patch(
    "/make-user",
    authMiddleware,
    adminMiddleware,
    makeUser
);

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getUsers
); 


export default router;