// User model for authentication
export interface User {
  id_user?: number;
  id_employe?: number;
  username: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  CHEF = 'CHEF',
  EMPLOYE = 'EMPLOYE'
}

// Login request
export interface LoginRequest {
  username: string;
  password: string;
}

// Login response from backend
export interface LoginResponse {
  message: string;
  username: string;
  role: string;
}

// src/app/core/models/user.model.ts
export interface RegisterRequest {
  username: string;
  password: string;
  role: UserRole;
  id_employe?: number;
}
