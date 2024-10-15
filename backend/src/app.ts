import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import patientRoutes from "./routes/patientRoute";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", patientRoutes);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
