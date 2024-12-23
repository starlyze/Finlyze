import express from "express";
import {connectDB} from "./config/db";
import {frontendURL, PORT, sendgridApiKey} from './config/secrets'
import authRoutes from "./routes/authRoutes";
import userDataRoutes from "./routes/userDataRoutes";

async function main() {
  const app = express();
  app.use(express.json());
  app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  await connectDB();
  app.use('/', authRoutes);
  app.use('/', userDataRoutes);
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

main();
