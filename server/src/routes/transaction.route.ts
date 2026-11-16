// General Import
import express from "express";

// Controller
import controller from "../controllers/transaction.controller";
import itemController from "../controllers/transactionItem.controller";

const router = express.Router();

// Transaction items
router.get("/:transactionId/items/:itemId", itemController.getTransactionItem);
router.get("/:transactionId/items", itemController.getTransactionItems);
router.post("/:transactionId/items", itemController.createTransactionItem);
router.patch("/:transactionId/items/:itemId", itemController.updateTransactionItem);
router.delete("/:transactionId/items/:itemId", itemController.deleteTransactionItem);

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