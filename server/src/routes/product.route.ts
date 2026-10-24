// General Import
import express from "express";

// Controller
import controller from "../controllers/product.controller";

const router = express.Router();

// GET
router.get("/options", controller.getProductOptions);
router.get("/:productId", controller.getProduct);
router.get("/", controller.getProducts);

// POST
router.post("/", controller.createProduct);

// PATCH
router.patch("/:productId", controller.updateProduct);

// DELETE
router.delete("/:productId", controller.deleteProduct);

export default router;
