import express from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoiceController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/", authenticateToken , createInvoice);


router.get("/", getAllInvoices);

// Get a single invoice by ID
router.get("/:id", getInvoiceById);

// Update an invoice by ID
router.put("/:id", updateInvoice);

// Delete an invoice by ID (soft delete)
router.delete("/:id", deleteInvoice);

export default router;