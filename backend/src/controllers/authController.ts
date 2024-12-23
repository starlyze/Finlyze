import bcrypt from 'bcrypt';
import {validateChangePassword, validateForgotPassword, validateSignin, validateSignup} from '../utils/validators';
import {
  frontendURL,
  googleAuthClientId, googleAuthClientSecret,
  googleAuthRedirectUri,
  jwtSecret,
} from "../config/secrets";
import User from '../models/userModel';
import {sendMail} from "../utils/sendMail";
import jwt, {JwtPayload} from "jsonwebtoken";
import {OAuth2Client} from "google-auth-library";
import axios from 'axios';
import verifyTemplate from '../views/verify'
import changePasswordTemplate from "../views/change-password";


const saltRounds = 10;
const cookieConfig = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: 365 * 24 * 60 * 60 * 1000
}

export const signup = async (req: any, res: any) => {
  const {valid, errors} = await validateSignup(req.body);
  if (!valid) return res.status(401).json({ message: 'Validation failed', errors });
  try {
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash
    });
    await newUser.save();
    res.status(201).json({ message: 'Redirect to verify email' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error during sign-up', error: error.message });
  }
};

export const sendVerificationEmail = async (req: any, res: any) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (user) {
      if (user.verified) res.status(401).json({ message: 'Email is already verified' });
      const verificationToken = jwt.sign({
        id: user.id,
        email: user.email,
      }, jwtSecret, { expiresIn: '1d' });
      user.authToken = verificationToken;
      await user.save();
      const emailTemplate = verifyTemplate(frontendURL!, verificationToken);
      await sendMail(req.body.email, {
        subject: 'Finlyze email verification',
        html: emailTemplate
      })
      res.status(201).json({ message: 'Email successfully sent' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Invalid email address', error: error.message });
  }
}

export const verifyEmail = async (req: any, res: any) => {
  try {
    const decoded = jwt.verify(req.query.token, jwtSecret) as JwtPayload;
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.verified) return res.status(400).json({ message: 'User is already verified.' });
    else if (user.authToken !== req.query.token) return res.status(400).json({ message: 'Invalid token. Check your most recent email.' });
    user.verified = true;
    await user.save();
    res.status(200).json({ message: 'Verification successful' });
  } catch (error: any) {
    res.status(400).json({ message: 'Invalid or expired token.', error: error.message });
  }
}

export const signin = async (req: any, res: any) => {
  const {user, valid, errors} = await validateSignin(req.body);
  if (!valid) return res.status(401).json({ message: 'Validation failed', errors });
  try {
    const token = jwt.sign({
      id: user.id,
      email: user.email,
      username: user.username,
    }, jwtSecret, { expiresIn: req.body.remember?'10d':'1d' });
    res.cookie('auth_jwt', token, cookieConfig);
    res.status(200).json({
      message: 'Logged in successfully.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      }
    })
  } catch (error: any) {
    res.status(400).json({ message: 'Error during sign-in', error: error.message });
  }
};

export const forgotPassword = async (req: any, res: any) => {
  const {user, valid, errors} = await validateForgotPassword(req.body);
  if (!valid) return res.status(401).json({ message: 'Validation failed', errors });
  try {
    const forgotPasswordToken = jwt.sign({
      id: user.id,
      email: user.email,
    }, jwtSecret, {expiresIn: '1d'});
    user.authToken = forgotPasswordToken;
    await user.save();
    const emailTemplate = changePasswordTemplate(frontendURL!, forgotPasswordToken);
    await sendMail(req.body.email, {
      subject: 'Finlyze change password',
      html: emailTemplate,
    });
    res.status(201).json({ message: 'Request to change password sent.' });
  } catch (error: any) {
    res.status(400).json({ message: 'Internal server error', error: error.messsage });
  }
}

export const changePassword = async (req: any, res: any) => {
  const { valid, errors } = validateChangePassword(req.body);
  if (!valid) return res.status(401).json({ message: 'Validation failed', errors });
  try {
    const decoded = jwt.verify(req.query.token, jwtSecret) as JwtPayload;
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found.' });
    if (user.authToken !== req.query.token) return res.status(401).json({ message: 'Invalid token. Check your most recent email.' });
    user.password = await bcrypt.hash(req.body.password, saltRounds);
    user.verified = true;
    await user.save();
    res.status(200).json({ message: 'Successfully changed password' });
  } catch (error: any) {
    res.status(400).json({ message: 'Invalid request', error: "Token is invalid or expired" });
  }
}

export const googleSignin = (req: any, res: any) => {
  res.header('Referrer-Policy', 'no-referrer-when-downgrade');
  const oAuth2Client = new OAuth2Client(
    googleAuthClientId,
    googleAuthClientSecret,
    googleAuthRedirectUri
  );
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.profile openid email',
    prompt: 'consent'
  })
  res.status(200).json({url: authorizeUrl});
}

export const googleCallback = async (req: any, res: any) => {
  const code = req.query.code;
  try {
    const oAuth2Client = new OAuth2Client(
      googleAuthClientId,
      googleAuthClientSecret,
      googleAuthRedirectUri
    );
    const oAuthResponse = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(oAuthResponse.tokens);
    const user = oAuth2Client.credentials;
    const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      }
    });
    const userData = userResponse.data;
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      const token = jwt.sign({
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
      }, jwtSecret, { expiresIn: '5d' });
      res.cookie('auth_jwt', token, cookieConfig);
      res.redirect(`${frontendURL}/dashboard`);
    } else {
      const newUser = new User({
        username: userData.name,
        email: userData.email,
        verified: true
      });
      await newUser.save();
      const token = jwt.sign({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      }, jwtSecret, { expiresIn: '5d' });
      res.cookie('auth_jwt', token, cookieConfig);
      res.redirect(`${frontendURL}/dashboard`);
    }
  } catch (error: any) {
    console.error(error);
    res.redirect(`${frontendURL}/signin`);
  }
}

export const fetchUserData = async (req: any, res: any) => {
  const token = req.query.token;
  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    const user = await User.findById(decoded.id);
    if (!user) res.status(401).json({ error: 'Invalid or expired token' });
    else res.status(200).json(decoded);
  } catch (error: any) {
    res.status(200).json({error: error});
  }
}
