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
    id: string;
    username: string;
    email: string;
  } | null;
  setUserData: (data: {
    token: string;
    id: string;
    username: string;
    email: string;
  }) => void;
  clearUserData: () => void;
}

export interface LoginResponse {
  token: string;
  data: {
    id: string;
    username: string;
    email: string;
  };
  message: string;
}

export interface RegisterResponse {
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
  };
}
