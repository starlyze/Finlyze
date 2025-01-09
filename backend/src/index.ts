import express from "express";
import {connectDB} from "./config/db";
import {frontendURL, PORT, sendgridApiKey} from './config/secrets'
import authRoutes from "./routes/auth.routes";
import userDataRoutes from "./routes/userData.routes";
import stockSearchRoutes from "./routes/stockSearch.routes";
import cors from 'cors'

async function main() {
  const app = express();
  app.use(express.json());
  app.use(cors({
    credentials: true,
  }));
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  await connectDB();
  app.use('/', authRoutes);
  app.use('/', userDataRoutes);
  app.use('/', stockSearchRoutes);
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

main();
