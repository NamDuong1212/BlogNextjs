export interface LoginState {
  email: string;
  password: string;
}

export interface RegisterState {
  username: string;
  email: string;
  password: string;
}

export interface UserState {
  accessToken: string | null;
  userData: {
    [key: string]: any;
  } | null;
  setUserData: (data: {
    token: string;
    user: {
      [key: string]: any;
    };
  }) => void;
  clearUserData: () => void;
}

export interface VerifyOtpState {
  email: string;
  otp: string;
}
