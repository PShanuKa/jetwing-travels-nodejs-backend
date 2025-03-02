import Company from "../models/companyModel.js";
import {
  responseTemplate,
  errorResponseTemplate,
} from "../utils/responseTemplate.js";
import asyncHandler from "express-async-handler";

export const createCompany = asyncHandler(async (req, res, next) => {
  const { name, description, isActive } = req.body;

  if (!name) {
    return errorResponseTemplate(res, 400, "Company name is required", next);
  }

  const companyExists = await Company.findOne({ name });
  if (companyExists) {
    return errorResponseTemplate(res, 400, "Company already exists", next);
  }

  const company = await Company.create({
    name,
    description,
    isActive,
    createdBy: req.user._id,
  });

  return responseTemplate(res, 201, "Company created successfully", company);
});

export const getAllCompanies = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, name, isActive } = req.query;

  const { user } = req;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (isNaN(pageNumber) || pageNumber <= 0) {
    return errorResponseTemplate(res, 400, "Invalid 'page' parameter", next);
  }
  if (isNaN(limitNumber) || limitNumber <= 0) {
    return errorResponseTemplate(res, 400, "Invalid 'limit' parameter", next);
  }
  
  const query = { isDeleted: false };
  if (user.role === "executive") {
    query.id = { $in: user.companies };
  }

  if (name) query.name = { $regex: name, $options: "i" };
  if (isActive !== undefined) query.isActive = isActive === "true";

  const totalCompanies = await Company.countDocuments(query);


  const companies = await Company.find(query)
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber);

  const meta = {
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(totalCompanies / limitNumber),
    totalCompanies,
  };

  return responseTemplate(res, 200, "Companies retrieved successfully", {
    companies,
    meta,
  });
});

export const getCompanyById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const company = await Company.findById(id);

  if (!company || company.isDeleted) {
    return errorResponseTemplate(res, 404, "Company not found", next);
  }

  return responseTemplate(res, 200, "Company retrieved successfully", company);
});

export const updateCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const company = await Company.findByIdAndUpdate(
    id,
    { ...updates, updatedBy: req.user._id },
    { new: true }
  );

  if (!company || company.isDeleted) {
    return errorResponseTemplate(res, 404, "Company not found", next);
  }

  return responseTemplate(res, 200, "Company updated successfully", company);
});

export const deleteCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const company = await Company.findByIdAndUpdate(
    id,
    { isDeleted: true, updatedBy: req.user._id },
    { new: true }
  );

  if (!company || company.isDeleted) {
    return errorResponseTemplate(res, 404, "Company not found", next);
  }

  return responseTemplate(res, 200, "Company deleted successfully");
});
