import { LoginState, RegisterState } from "../types/auth";

export const validateLogin = (formData: LoginState): string | null => {
  const { email, password } = formData;

  if (!email || !password) {
    return "All fields are required";
  }

  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!pattern.test(email)) {
    return "Invalid email format";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};

export const validateRegister = (formData: RegisterState): string | null => {
  const { username, email, password} = formData;

  if (!username || !email || !password ) {
    return "All fields are required";
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(email)) {
    return "Invalid email format";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};
