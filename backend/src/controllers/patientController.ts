import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { createPatient } from "../models/patientModel";
import { sendConfirmationEmail } from "../services/emailService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  documentPhoto: z.string().url("Invalid URL for the document photo"),
});

export const registerPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone, documentPhoto } = patientSchema.parse(req.body);

    await createPatient(name, email, phone, documentPhoto);

    sendConfirmationEmail(email, name);

    res.status(201).json({ message: "Patient registered successfully!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next({ status: 400, message: error.errors[0].message });
    }
    res.status(500).json({ message: "Error registering patient" });
  }
};

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await prisma.patient.findMany();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients" });
  }
};
