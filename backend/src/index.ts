import express from "express";
import {connectDB} from "./config/db";
import {PORT} from './config/secrets'
import {changePassword, forgotPassword, signin, signup, verifyEmail} from "./controllers/authController";

const app = express();
app.use(express.json());
connectDB().then(() => {
  app.post('/api/signup', signup);
  app.post('/api/signin', signin);
  app.get('/api/verify-email', verifyEmail);
  app.post('/api/forgot-password', forgotPassword);
  app.post('/api/change-password', changePassword);

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})

