// General Import
import express from "express";

// Controller
import controller from "../controllers/supplier.controller";

const router = express.Router();

// GET
router.get("/:supplierId", controller.getSupplier);
router.get("/", controller.getSuppliers);

// POST
router.post("/", controller.createSupplier);

// PATCH
router.patch("/:supplierId", controller.updateSupplier);

// DELETE
router.delete("/:supplierId", controller.deleteSupplier);

export default router;
