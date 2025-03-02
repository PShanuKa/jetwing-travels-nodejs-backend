import { Router } from "express";
import { createUser, loginUser, logoutUser, getAllUsers, refreshToken, getUserById, updateUser } from "../controllers/userController.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Auth Routes
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);

// User Routes
router.post("/create",  authenticateToken, isAdmin( ["admin", "superadmin"]), createUser);
router.get("/all",  authenticateToken , isAdmin( ["admin", "superadmin"]), getAllUsers);
router.put("/:id",  authenticateToken, isAdmin( ["admin", "superadmin"]), updateUser);
router.get("/:id",  authenticateToken, isAdmin( ["admin", "superadmin"]), getUserById);

    


export default router;
