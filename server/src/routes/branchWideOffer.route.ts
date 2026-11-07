// General Import
import express from "express";

// Controller
import controller from "../controllers/branchWideOffer.controller";

const router = express.Router();

// GET
router.get("/options", controller.getOptions);
router.get("/:offerId", controller.getOffer);
router.get("/", controller.getOffers);

// POST
router.post("/", controller.createOffer);

// PATCH
router.patch("/:offerId", controller.updateOffer);

// DELETE
router.delete("/:offerId", controller.deleteOffer);

export default router;
