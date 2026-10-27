// General Import
import express from "express";

// Controller
import controller from "../controllers/branchInventory.controller";

const router = express.Router();

// GET
router.get("/options", controller.getItemOptions);
router.get("/:itemId", controller.getItem);
router.get("/", controller.getItems);

// POST
router.post("/", controller.createItem);

// PATCH
router.patch("/:itemId/restock", controller.restockItem);

// DELETE
router.delete("/:itemId", controller.deleteItem);

export default router;
