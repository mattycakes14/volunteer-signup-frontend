// User types
export type UserRole = "undergraduate" | "graduate" | "admin";

export type User = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string; // Optional
  year?: string; // Optional
  major?: string; // Optional
  created_at: string;
};

// Signup request body (POST /auth/signup)
export type SignupRequest = {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phone?: string;
  year?: string;
  major?: string;
};

// Login request body (POST /auth/signin)
export type LoginRequest = {
  email: string;
  password: string;
};

// Auth response (from signup/signin)
export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};

// Update user profile (PATCH /users/{id})
export type UpdateUserRequest = Partial<Omit<User, 'id' | 'email' | 'created_at'>>;
