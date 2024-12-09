import express from "express";
import {connectDB} from "./config/db";
import {PORT} from './config/secrets'
import authRoutes from "./routes/authRoutes";

const app = express();
app.use(express.json());
connectDB().then(() => {
  app.use('/', authRoutes)
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})
