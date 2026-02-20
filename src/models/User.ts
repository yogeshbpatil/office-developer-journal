export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Developer' | 'Senior Developer' | 'Team Lead' | 'Manager';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
