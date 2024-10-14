import { Router } from "express";
import { getPatients, registerPatient } from "../controllers/patientController";

const patientRoutes = Router();

patientRoutes.post("/patients", registerPatient);
patientRoutes.get("/patients", getPatients);

export default patientRoutes;
