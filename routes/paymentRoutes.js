import express from "express";

import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  retryPayment,
captureContext,
} from "../controllers/paymentController.js";

const router = express.Router();

// router.post("/", createPayment);

// router.get("/", getAllPayments);

// router.get("/:id", getPaymentById);

// router.put("/:id", updatePayment);


// router.post("/", createPayment);

router.post("/capture-context", captureContext);


// router.post("/:id/retry", retryPayment);

export default router;