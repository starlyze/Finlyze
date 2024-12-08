import express from "express";
import {connectDB} from "./config/db";
import {PORT} from './config/secrets'
import {signin, signup, verifyEmail} from "./controllers/authController";

const app = express();
app.use(express.json());
connectDB()

app.post('/api/signup', signup);
app.post('/api/signin', signin);
app.get('/api/verify-email', verifyEmail);


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
