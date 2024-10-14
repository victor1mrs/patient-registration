import { describe, it, expect, vi } from "vitest";
import { createPatient } from "../models/patientModel";
import { PrismaClient } from "@prisma/client";

vi.mock("@prisma/client", () => {
  const mPrisma = {
    patient: {
      create: vi.fn(),
    },
  };
  return { PrismaClient: vi.fn(() => mPrisma) };
});

const prisma = new PrismaClient();

describe("Patient Service", () => {
  it("should create a new patient", async () => {
    const patientData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      documentPhoto: "http://example.com/photo.jpg",
    };

    await createPatient(
      patientData.name,
      patientData.email,
      patientData.phone,
      patientData.documentPhoto
    );

    expect(prisma.patient.create).toHaveBeenCalledWith({
      data: patientData,
    });
  });
});
