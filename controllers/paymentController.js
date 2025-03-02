import Payment from "../models/paymentModel.js";
import { responseTemplate, errorResponseTemplate } from "../utils/responseTemplate.js";
import asyncHandler from "express-async-handler";


export const createPayment = asyncHandler(async (req, res, next) => {
  const {
    invoice,
    customer,
    amount,
    currency,
    paymentMethod,
    ipgReference,
  } = req.body;

  const payment = await Payment.create({
    invoice,
    customer,
    amount,
    currency,
    paymentMethod,
    ipgReference,
  });

  return responseTemplate(res, 201, "Payment created successfully", payment);
});


export const getAllPayments = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    status,
    currency,
    paymentMethod,
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
  if (status) query.status = status;
  if (currency) query.currency = currency;
  if (paymentMethod) query.paymentMethod = paymentMethod;


  const totalPayments = await Payment.countDocuments(query);

  const payments = await Payment.find(query)
    .populate("invoice", "invoiceNumber totalAmount")
    .populate("customer", "firstName lastName email")
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber);


  const meta = {
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(totalPayments / limitNumber),
    totalPayments,
  };


  return responseTemplate(res, 200, "Payments retrieved successfully", {
    payments,
    meta,
  });
});


export const getPaymentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const payment = await Payment.findById(id)
    .populate("invoice", "invoiceNumber totalAmount")
    .populate("customer", "firstName lastName email");

  if (!payment) {
    return errorResponseTemplate(res, 404, "Payment not found", next);
  }

  return responseTemplate(res, 200, "Payment retrieved successfully", payment);
});


export const updatePayment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const payment = await Payment.findByIdAndUpdate(id, updates, { new: true })
    .populate("invoice", "invoiceNumber totalAmount")
    .populate("customer", "firstName lastName email");

  if (!payment) {
    return errorResponseTemplate(res, 404, "Payment not found", next);
  }

  return responseTemplate(res, 200, "Payment updated successfully", payment);
});


export const retryPayment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const payment = await Payment.findById(id);

  if (!payment) {
    return errorResponseTemplate(res, 404, "Payment not found", next);
  }

  if (payment.attempts >= 3) {
    return errorResponseTemplate(
      res,
      400,
      "Maximum retry attempts reached. Please generate a new payment link.",
      next
    );
  }

 
  payment.attempts += 1;
  payment.status = "Pending"; 
  await payment.save();

  return responseTemplate(res, 200, "Payment retry initiated successfully", payment);
});