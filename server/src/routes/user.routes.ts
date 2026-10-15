// General Import
import express from "express";

// Controller
import controller from "../controllers/user.controller";

const router = express.Router();

// GET
router.get("/me", controller.getCurrentUser);

// POST

// PATCH

// DELETE

export default router;
