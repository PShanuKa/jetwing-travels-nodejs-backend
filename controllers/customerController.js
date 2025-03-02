import Customer from "../models/customerModel.js";
import {
  responseTemplate,
  errorResponseTemplate,
} from "../utils/responseTemplate.js";
import asyncHandler from "express-async-handler";

// Create a new customer
export const createCustomer = asyncHandler(async (req, res, next) => {
  const {
    title,
    firstName,
    lastName,
    address,
    email,
    secondaryEmail,
    phone,
    nicOrPassport,
    country,
    postalCode,
    company,
  } = req.body;

  const user = req.user;

  const customer = await Customer.create({
    title,
    firstName,
    lastName,
    address,
    email,
    secondaryEmail,
    phone,
    nicOrPassport,
    country,
    postalCode,
    createdBy: user._id,
    company,
  });

  return responseTemplate(res, 201, "Customer created successfully");
});

export const getAllCustomers = asyncHandler(async (req, res, next) => {
  // Extract query parameters
  const {
    page = 1,
    limit = 10,
    name,
    email,
    phone,
    country,
    title,
  } = req.query;

  const user = req.user;

  // Validate pagination parameters
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (isNaN(pageNumber) || pageNumber <= 0) {
    return errorResponseTemplate(res, 400, "Invalid 'page' parameter", next);
  }
  if (isNaN(limitNumber) || limitNumber <= 0) {
    return errorResponseTemplate(res, 400, "Invalid 'limit' parameter", next);
  }

  const query = { isDeleted: false };

  if (name) {
    query.$or = [
      { firstName: { $regex: name, $options: "i" } },
      { lastName: { $regex: name, $options: "i" } },
    ];
  }

  if(user.role === "executive"){
    query.company = { $in: user.companies };
  }

  if (email) query.email = { $regex: email, $options: "i" };
  if (phone) query.phone = { $regex: phone, $options: "i" };
  if (country) query.country = { $regex: country, $options: "i" };
  if (title) query.title = { $regex: title, $options: "i" };

  const totalCustomers = await Customer.countDocuments(query);

  const customers = await Customer.find(query)
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber);

  const meta = {
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(totalCustomers / limitNumber),
    totalCustomers,
  };

  return responseTemplate(res, 200, "Customers retrieved successfully", {
    customers,
    meta,
  });
});

export const getCustomerById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);

  if (!customer || customer.isDeleted) {
    return errorResponseTemplate(res, 404, "Customer not found", next);
  }

  return responseTemplate(
    res,
    200,
    "Customer retrieved successfully",
    customer
  );
});

export const updateCustomer = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const customer = await Customer.findByIdAndUpdate(id, updates, { new: true });

  if (!customer || customer.isDeleted) {
    return errorResponseTemplate(res, 404, "Customer not found", next);
  }

  return responseTemplate(res, 200, "Customer updated successfully", customer);
});

export const deleteCustomer = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const customer = await Customer.findById(
    id
  );

  if (!customer) {
    return errorResponseTemplate(res, 404, "Customer not found", next);
  }

  if (customer.isDeleted) {
    return errorResponseTemplate(res, 404, "Customer already deleted", next);
  }

  customer.isDeleted = true;
  await customer.save();

  return responseTemplate(res, 200, "Customer deleted successfully");
});
