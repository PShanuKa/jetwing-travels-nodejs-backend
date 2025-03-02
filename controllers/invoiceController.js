import Invoice from "../models/invoiceModel.js";
import { responseTemplate, errorResponseTemplate } from "../utils/responseTemplate.js";
import asyncHandler from "express-async-handler";


export const createInvoice = asyncHandler(async (req, res, next) => {
  const {
    customer,
    invoiceNumber,
    title,
    tourNumber,
    firstName,
    lastName,
    email,
    secondaryEmail,
    phone,
    ccEmail,
    ccEmail2,
    address,
    country,
    postalCode,
    nicOrPassport,
    totalAmount,
    advancePayment,
    dueDate,
    paymentStatus,
    paymentHistory,
    invoiceItems,
  } = req.body;

  const {user} = req;

  const invoice = await Invoice.create({
    customer,
    createdBy: user._id,
    invoiceNumber,
    title,
    tourNumber,
    firstName,
    lastName,
    email,
    secondaryEmail,
    phone,
    ccEmail,
    ccEmail2,
    address,
    country,
    postalCode,
    nicOrPassport,
    totalAmount,
    advancePayment,
    dueDate,
    paymentStatus,
    paymentHistory,
    invoiceItems,
  });

  return responseTemplate(res, 201, "Invoice created successfully", invoice);
});


export const getAllInvoices = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    invoiceNumber,
    firstName,
    lastName,
    email,
    phone,
    paymentStatus,
  } = req.query;

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

  if (invoiceNumber) query.invoiceNumber = { $regex: invoiceNumber, $options: "i" };
  if (firstName) query.firstName = { $regex: firstName, $options: "i" };
  if (lastName) query.lastName = { $regex: lastName, $options: "i" };
  if (email) query.email = { $regex: email, $options: "i" };
  if (phone) query.phone = { $regex: phone, $options: "i" };
  if (paymentStatus) query.paymentStatus = paymentStatus;

  const totalInvoices = await Invoice.countDocuments(query);

  const invoices = await Invoice.find(query)
    .populate("customer", "firstName lastName email")
    .populate("createdBy", "firstName lastName email")
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber);

  const meta = {
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(totalInvoices / limitNumber),
    totalInvoices,
  };

  return responseTemplate(res, 200, "Invoices retrieved successfully", {
    invoices,
    meta,
  });
});


export const getInvoiceById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const invoice = await Invoice.findById(id)
    .populate("customer", "firstName lastName email")
    .populate("createdBy", "firstName lastName email");

  if (!invoice || invoice.isDeleted) {
    return errorResponseTemplate(res, 404, "Invoice not found", next);
  }

  return responseTemplate(res, 200, "Invoice retrieved successfully", invoice);
});


export const updateInvoice = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const invoice = await Invoice.findByIdAndUpdate(id, updates, { new: true })
    .populate("customer", "firstName lastName email")
    .populate("createdBy", "firstName lastName email");

  if (!invoice || invoice.isDeleted) {
    return errorResponseTemplate(res, 404, "Invoice not found", next);
  }

  return responseTemplate(res, 200, "Invoice updated successfully", invoice);
});

export const deleteInvoice = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const invoice = await Invoice.findById(
    id,
  );

  if (!invoice) {
    return errorResponseTemplate(res, 404, "Invoice not found", next);
  }

  if (invoice.isDeleted) {
    return errorResponseTemplate(res, 404, "Invoice already deleted", next);
  }

  invoice.isDeleted = true;
  await invoice.save();

  return responseTemplate(res, 200, "Invoice deleted successfully");
});