import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createCustomer);
router.get("/", authenticateToken, getAllCustomers);
router.get("/:id", authenticateToken, getCustomerById);
router.put("/:id", authenticateToken, updateCustomer);
router.delete("/:id", authenticateToken , deleteCustomer);

export default router;
