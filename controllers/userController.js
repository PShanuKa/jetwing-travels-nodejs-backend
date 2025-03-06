import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import {
  errorResponseTemplate,
  responseTemplate,
} from "../utils/responseTemplate.js";
import { generateToken } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler"; // Import asyncHandler

// Create a new user
export const createUser = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    address,
    phone,
    nicOrPassport,
    role,
    status,
    companies,
  } = req.body;

  if (!password) return errorResponseTemplate(res, 400, "Password is required", next);

  const hashedPassword = await bcrypt.hash(password, 10);
  const userExists = await User.findOne({ email });
  if (userExists) return errorResponseTemplate(res, 400, "User already exists", next);

  const user = await User.create({
    firstName: firstName,
    lastName: lastName,
    email,
    password: hashedPassword,
    address: address,
    phone: phone,
    nicOrPassport: nicOrPassport,
    role: role,
    status: status,
    companies: companies,
  });

  return responseTemplate(res, 201, "User created successfully");
});

// Login user
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password , rememberMe } = req.body;

  const userExists = await User.findOne({ email });
  if (!userExists || !(await bcrypt.compare(password, userExists.password)))
    return errorResponseTemplate(res, 401, "Invalid email or password", next);

  const { accessToken, refreshToken } = await generateToken(userExists._id);

  userExists.refreshToken = refreshToken;
  await userExists.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
  });

  const { password: _, refreshToken: refresh, ...user } = userExists._doc;

  return responseTemplate(res, 200, "User logged in successfully", {
    token: accessToken,
    user: user,
  });
});

// Refresh token
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    return errorResponseTemplate(res, 401, "Refresh token not found", next);

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const userExists = await User.findById(decoded.id);
  if (!userExists || userExists.refreshToken !== refreshToken)
    return errorResponseTemplate(res, 401, "Invalid refresh token", next);

  const { accessToken } = await generateToken(userExists._id);

  return responseTemplate(res, 200, "Token refreshed successfully", {
    token: accessToken,
  });
});

// Update user
export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    password,
    address,
    phone,
    nicOrPassport,
    role,
    status,
    companies,
  } = req.body;

  // const user = req.user;

  // // if(user.role === "executive"){
  // //   return errorResponseTemplate(res, 403, "You are not authorized to update this user", next);
  // // }


  const userExists = await User.findById(id);
  if (!userExists) return errorResponseTemplate(res, 404, "User not found", next);

  if (password) {
    userExists.password = await bcrypt.hash(password, 10);
  }



  userExists.firstName = firstName;
  userExists.lastName = lastName;
  userExists.email = email;
  userExists.address = address;
  userExists.phone = phone;
  userExists.nicOrPassport = nicOrPassport;
  userExists.role = role;
  userExists.status = status;
  userExists.companies = companies;
  await userExists.save();

  const { password: _, refreshToken: refresh, ...users } = userExists._doc;

  return responseTemplate(res, 200, "User updated successfully", users);
});


export const logoutUser = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    return responseTemplate(res, 200, "No refresh token found", null);

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const userExists = await User.findById(decoded.id);
  if (!userExists || userExists.refreshToken !== refreshToken)
    return errorResponseTemplate(res, 401, "Invalid refresh token", next);

  userExists.refreshToken = null;
  await userExists.save();

  res.clearCookie("refreshToken");

  return responseTemplate(res, 200, "User logged out successfully");
});


export const getAllUsers = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    email,
    firstName,
    lastName,
    status,
  } = req.query;

  


  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (isNaN(pageNumber) || pageNumber <= 0) {
    return errorResponseTemplate(res, 400, "Invalid 'page' parameter", next);
  }
  if (isNaN(limitNumber) || limitNumber <= 0) {
    return errorResponseTemplate(res, 400, "Invalid 'limit' parameter", next);
  }


  const query = {};
  if (email) query.email = { $regex: email, $options: "i" };
  if (firstName) query.firstName = { $regex: firstName, $options: "i" };
  if (lastName) query.lastName = { $regex: lastName, $options: "i" };
  if (status) query.status = status;


  const totalUsers = await User.countDocuments(query);


  const users = await User.find(query)
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber).select("-password -refreshToken");


  const meta = {
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(totalUsers / limitNumber),
    totalUsers,
  };


  return responseTemplate(res, 200, "Users retrieved successfully", {
    users,
    meta,
  });
});


export const getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");
  if (!user) return responseTemplate(res, 404, "User not found", null);

  return responseTemplate(res, 200, "User retrieved successfully", user);
});