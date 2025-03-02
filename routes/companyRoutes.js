import express from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, isAdmin(["superadmin"]), createCompany);
router.get("/", authenticateToken, getAllCompanies);
router.get("/:id", authenticateToken, isAdmin(["superadmin"]), getCompanyById);
router.put("/:id", authenticateToken, isAdmin(["superadmin"]), updateCompany);
router.delete(
  "/:id",
  authenticateToken,
  isAdmin(["superadmin"]),
  deleteCompany
);

export default router;
