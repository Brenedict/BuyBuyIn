// General Imports
import express from "express";

// Controllers
import controller from "../controllers/auth.controller";

const router = express.Router();

// Auth Routes
router.post("/login", controller.loginPost);
router.post("/logout", controller.logoutPost);

// Protected Route
router.get("/protected", controller.protectedGet);

export default router;
