// General Import
import express from "express";

// Controller
import controller from "../controllers/transaction.controller";

const router = express.Router();

// GET
router.get("/:transactionId", controller.getTransaction);
router.get("/", controller.getTransactions);

// POST
router.post("/", controller.createTransaction);

// PATCH
router.patch("/:transactionId", controller.updateTransaction);

// DELETE
router.delete("/:transactionId", controller.deleteTransaction);

export default router;