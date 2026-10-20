import express from "express";
import controller from "../controllers/payment.controller";

const router = express.Router();

router.post("/checkout", controller.createCheckout);
router.post("/webhook", controller.handleWebhook);

export default router;