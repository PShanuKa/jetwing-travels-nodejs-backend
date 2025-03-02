import express from "express";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import customerRoutes from "./routes/customerRoutes.js";
import invoiceRoutes from "./routes/invoiceRoute.js";
import companyRoutes from "./routes/companyRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";

dotenv.config();

export const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/api", (req, res) => res.send("API is running"));
app.use("/api/user", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/meta", metaRoutes);




app.use(notFound);
app.use(errorHandler);
