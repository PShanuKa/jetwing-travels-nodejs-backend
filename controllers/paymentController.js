import axios from "axios";
// import Payment from "../models/paymentModel.js";
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



export const captureContext = asyncHandler(async (req, res, next) => {
  const { amount, currency } = req.body;

  try {
    // Define the headers as per the curl request
    const headers = {
      'Authorization': 'Bearer 6a1c969b375b30b3ba572ee252aa457a', // Replace with your actual API key
      'Content-Type': 'application/json',
      'Date': 'Tue, 10 Oct 2023 12:34:56 GMT', // Static date value from the curl request
      'v-c-merchant-id': 'tashinisomarathnecompany', // Merchant ID from the curl request
      'signature': 'ac0e6531185f472d9dbbfa8df8d2ab48accc5be3f2d04d8ab7d9570d0c262846a0145343e5b84fa8a6899554abed4226e4857f326bec484fb6903564895692a20f46026eaa5c4455b857a8a55fc5d37220e12fb9a819402282fc2cdb4c5d5b9bd47037bde3ad47c68d3cfe45c35d3d1090cc677781a24ce0b508107748c9c5ed' // Signature from the curl request
    };

    // Define the payload as per the curl request
    const payload = {
      targetOrigins: ["https://jetwing.duckdns.org/"], // Updated target origin
      clientVersion: "0.23",
      allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX"],
      allowedPaymentTypes: ["PANENTRY", "CLICKTOPAY", "GOOGLEPAY"],
      country: "US",
      locale: "en_US",
      captureMandate: {
        billingType: "FULL",
        requestEmail: true,
        requestPhone: true,
        requestShipping: true,
        shipToCountries: ["US", "GB"],
        showAcceptedNetworkIcons: true
      },
      orderInformation: {
        amountDetails: {
          totalAmount: amount, 
          currency: currency 
        }
      }
    };

  
    const response = await axios.post('https://apitest.cybersource.com/up/v1/capture-contexts', payload, { headers })

  
    console.log(response);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate capture context' });
  }
});
