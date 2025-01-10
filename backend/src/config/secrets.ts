require('dotenv').config();
import {Secret} from "jsonwebtoken";

export const jwtSecret = process.env.JWT_SECRET as Secret;
export const mongoURI = process.env.MONGO_URI;
export const PORT = process.env.PORT;
export const frontendURL = process.env.FRONTEND_URL;
export const mailerPassword = process.env.MAILER_PASSWORD;
export const googleAuthClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
export const googleAuthClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
export const googleAuthRedirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
export const alphaVantageApiKey = process.env.ALPHA_VANTAGE_API_KEY;
export const alpacaApiKey = process.env.ALPACA_API_KEY;
export const alpacaSecretKey = process.env.ALPACA_SECRET_KEY;
