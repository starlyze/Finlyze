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
import axios from "axios";
import verifyTemplate from '../views/verify'
import changePasswordTemplate from "../views/change-password";

const saltRounds = 10;

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
    // const savedUser = await newUser.save();
    // const verificationToken = jwt.sign({
    //   id: savedUser.id,
    //   email: savedUser.email,
    // }, jwtSecret, { expiresIn: '1d'});
    // const emailTemplate = verifyTemplate(frontendURL!, verificationToken);
    // await sendMail(req.body.email, {
    //   subject: 'Finlyze email verification',
    //   html: emailTemplate,
    // });
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
    res.status(200).json({
      message: 'Logged in successfully.',
      token: token,
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
    user.password = await bcrypt.hash(req.body.password, saltRounds);
    await user.save();
    res.status(200).json({ message: 'Successfully changed password' });
  } catch (error: any) {
    res.status(400).json({ message: 'Invalid request', error: "Token is invalid or expired" });
  }
}

export const googleSignin = (req: any, res: any) => {
  const url = `https://accounts.google.com/o/oauth/v2/auth?client_id=${googleAuthClientId}&redirect_uri=${googleAuthRedirectUri}&response_type=code&scope=profile email`;
  res.redirect(url);
}

export const googleCallback = async (req: any, res: any) => {
  const { code } = req.query;
  try {
    const { data } = await axios.post('<https://oauth2.googleapis.com/token>', {
      client_id: googleAuthClientId,
      client_secret: googleAuthClientSecret,
      code: code,
      redirect_uri: googleAuthRedirectUri,
      grant_type: 'authorization_code'
    });
    const { access_token, id_token } = data;
    const { data: profile } = await axios.get('<https://www.googleapis.com/oauth2/v1/userinfo>', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    console.log(profile);
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.redirect('/login');
  }
}
