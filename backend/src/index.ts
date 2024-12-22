import express from "express";
import {connectDB} from "./config/db";
import {PORT, sendgridApiKey} from './config/secrets'
import authRoutes from "./routes/authRoutes";
import userDataRoutes from "./routes/userDataRoutes";

const app = express();
app.use(express.json());
connectDB().then(() => {
  app.use('/', authRoutes);
  app.use('/', userDataRoutes);
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})
