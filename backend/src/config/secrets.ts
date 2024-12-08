import {Secret} from "jsonwebtoken";

export const jwtSecret = process.env.JWT_SECRET as Secret;
export const mongoURI = process.env.MONGO_URI;
