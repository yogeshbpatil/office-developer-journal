import { LoginCredentials, AuthResponse, User } from '@/models/User';

// Mock user database
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Senior Developer',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Team Lead',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'Developer',
  },
];

// Mock password: "password123" for all users
const MOCK_PASSWORD = 'password123';

/**
 * Mock authentication service
 * Simulates async API call with delay
 * In production, replace with actual API call using apiClient
 */
export const authService = {
  /**
   * Login user with email and password
   * @param credentials - User login credentials
   * @returns Promise with user data and token
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const { email, password } = credentials;

    // Validate credentials
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user || password !== MOCK_PASSWORD) {
      throw new Error('Invalid email or password');
    }

    // Generate mock JWT token
    const mockToken = `mock_jwt_token_${user.id}_${Date.now()}`;

    return {
      user,
      token: mockToken,
    };
  },

  /**
   * Verify current token (for future implementation)
   * @param token - JWT token to verify
   */
  async verifyToken(token: string): Promise<User> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // In production, this would make an API call to verify the token
    // For now, just extract user id from mock token
    const userId = token.split('_')[3];
    const user = MOCK_USERS.find((u) => u.id === userId);

    if (!user) {
      throw new Error('Invalid token');
    }

    return user;
  },

  /**
   * Register new user (for future implementation)
   */
  async register(userData: Omit<User, 'id'> & { password: string }): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // This would be implemented when backend is ready
    throw new Error('Registration not implemented yet');
  },
};

/**
 * Future implementation with real API:
 * 
 * export const authService = {
 *   async login(credentials: LoginCredentials): Promise<AuthResponse> {
 *     return apiClient.post<AuthResponse>('/auth/login', credentials);
 *   },
 * 
 *   async verifyToken(token: string): Promise<User> {
 *     return apiClient.get<User>('/auth/verify');
 *   },
 * 
 *   async register(userData: RegisterDto): Promise<AuthResponse> {
 *     return apiClient.post<AuthResponse>('/auth/register', userData);
 *   },
 * };
 */
