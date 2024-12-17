export interface LoginState {
    email: string;
    password: string;
  }
  
  export interface RegisterState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string; // Optional
  }
  
  export interface UserState {
    accessToken: string | null;
    userData: {
      id: string;
      name: string;
    } | null
    setUserData: (data: { token: string; id: string; name: string }) => void
    clearUserData: () => void
  }
  
  export interface LoginResponse {
    token: string;
    data: {
      id: string;
      name: string;
    };
    message: string;
  }
  
  export interface RegisterResponse {
    message: string;
    data: {
      id: string;
      name: string;
      email: string;
    };
  }