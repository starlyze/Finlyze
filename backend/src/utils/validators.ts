import User from '../models/userModel';
import bcrypt from "bcrypt";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignup = async (data: any) => {
  const errors: any = {};
  if (!data.username || typeof data.username !== 'string') {
    errors.username = 'Username is required and must be a string.';
  } else if (data.username.length < 3 || data.username.length > 20) {
    errors.username = 'Username must be between 3 and 20 characters.';
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
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!data.password || typeof data.password !== 'string') {
    errors.password = 'Password is required and must be a string.';
  } else if (!passwordRegex.test(data.password)) {
    errors.password = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.';
  }

  if (!data.confirmpassword || typeof data.confirmpassword !== 'string') {
    errors.confirmpassword = 'All input fields are required and must be strings.';
  } else if (data.password !== data.confirmpassword) {
    errors.confirmpassword = 'Passwords are not equal.';
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
  } else if (!data.password || typeof data.password !== 'string') {
    errors.password = 'Password is required and must be a string.';
  } else {
    try {
      result.user = await User.findOne({ email: data.email });
      if (!result.user) {
        errors.email = "No account is registered with this email.";
      } else if (!result.user.verified) {
        errors.email = "Email is not verified";
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
