import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPatient = async (
  name: string,
  email: string,
  phone: string,
  documentPhoto: string
) => {
  return await prisma.patient.create({
    data: {
      name,
      email,
      phone,
      documentPhoto,
    },
  });
};
