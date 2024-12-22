import User from '../models/userModel';
import bcrypt from "bcrypt";

const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export const validateSignup = async (data: any) => {
  const errors: any = {};
  if (!data.username || typeof data.username !== 'string') {
    errors.username = 'Username is required and must be a string.';
  } else if (!usernameRegex.test(data.username)) {
    errors.username = 'Username must be between 3 and 20 characters and can only contain letters, numbers, dots, underscores, and hyphens.';
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.email = 'Email is required and must be a string.';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Invalid email format.';
  } else {
    try {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        errors.email = "Email is already in use.";
      }
    } catch (error) {
      errors.server = "Internal Server Error";
    }
  }
  if (!data.password || typeof data.password !== 'string') {
    errors.password = 'Password is required and must be a string.';
  } else if (!passwordRegex.test(data.password)) {
    errors.password = 'Password must be at least 8 characters long and include at least one number.';
  }

  if (!data.confirmPassword || typeof data.confirmPassword !== 'string') {
    errors.confirmPassword = 'All input fields are required and must be strings.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords are not equal.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export const validateSignin = async (data: any) => {
  const errors: any = {};
  const result: any = {};
  if (!data.email || typeof data.email !== 'string') {
    errors.email = 'Email is required and must be a string.';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Invalid email format.';
  }
  if (!data.password || typeof data.password !== 'string') {
    errors.password = 'Password is required and must be a string.';
  } else if (!errors.email) {
    try {
      result.user = await User.findOne({ email: data.email });
      if (!result.user) {
        errors.email = "No account is registered with this email.";
      } else if (!result.user.verified) {
        errors.verify = true;
      } else if (!result.user.password) {
        errors.email = "This account is already linked with google."
      } else {
        const passwordsMatch = await bcrypt.compare(data.password, result.user.password);
        if (!passwordsMatch) errors.password = 'Passwords do not match.';
      }
    } catch (error) {
      errors.server = "Internal Server Error";
    }
  }
  result.valid = Object.keys(errors).length === 0;
  result.errors = errors;
  return result;
}

export const validateForgotPassword = async (data: any) => {
  const errors: any = {};
  const result: any = {};
  if (!data.email || typeof data.email !== 'string') {
    errors.email = 'Email is required and must be a string.';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Invalid email format.';
  } else {
    try {
      result.user = await User.findOne({ email: data.email });
      if (!result.user) errors.email = "No account is registered with this email.";
    } catch (error) {
      errors.server = "Internal Server Error";
    }
  }
  result.valid = Object.keys(errors).length === 0;
  result.errors = errors;
  return result;
}

export const validateChangePassword = (data: any) => {
  const errors: any = {};
  if (!data.password || typeof data.password !== 'string') {
    errors.password = 'Password is required and must be a string.';
  } else if (!passwordRegex.test(data.password)) {
    errors.password = 'Password must be at least 8 characters long and include at least one number.';
  }
  if (!data.confirmPassword || typeof data.confirmPassword !== 'string') {
    errors.confirmPassword = 'All input fields are required and must be strings.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords are not equal.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
