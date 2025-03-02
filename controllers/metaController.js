import metaModel from "../models/metaModel.js";
import { responseTemplate, errorResponseTemplate } from "../utils/responseTemplate.js";
import asyncHandler from "express-async-handler";

// Create or Update Meta Record
export const upsertMeta = asyncHandler(async (req, res, next) => {
  const { master, visa, amex } = req.body;

  // Check if a meta record already exists
  let meta = await metaModel.findOne();

  if (!meta) {
    // If no record exists, create a new one
    meta = await metaModel.create({
      master,
      visa,
      amex,
    });

    return responseTemplate(res, 201, "Meta record created successfully", meta);
  }

  // If a record exists, update it
  meta.master = master || meta.master;
  meta.visa = visa || meta.visa;
  meta.amex = amex || meta.amex;

  await meta.save();

  return responseTemplate(res, 200, "Meta record updated successfully", meta);
});

// Get Meta Record
export const getMeta = asyncHandler(async (req, res, next) => {
  const meta = await metaModel.findOne();

  if (!meta) {
    return errorResponseTemplate(res, 404, "Meta record not found", next);
  }

  return responseTemplate(res, 200, "Meta record retrieved successfully", meta);
});