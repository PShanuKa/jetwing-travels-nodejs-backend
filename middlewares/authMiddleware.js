import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { errorResponseTemplate } from "../utils/responseTemplate.js";
import asyncHandler from "express-async-handler"; 


export const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token not found" });

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  req.user = await User.findById(decoded.id);

  if (!req.user) return errorResponseTemplate(res, 401, "User not found", next);

  next();
});


export const isAdmin = (allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponseTemplate(res, 403, "You are not authorized to access this resource", next);
    }
    next();
  });
};