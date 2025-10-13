import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET;
const JWT_EXPIRES_IN = '1h';
const REFRESH_EXPIRES_IN = '7d';

export interface UserPayload {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: UserPayload;
  token: string;
  refreshToken: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(payload: UserPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static generateRefreshToken(payload: Pick<UserPayload, 'id' | 'email' | 'role'>): string {
    // Keep refresh token smaller - do not include names
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
  }

  static verifyToken(token: string): UserPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as UserPayload;
    } catch {
      return null;
    }
  }

  static async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: 'USER'
        }
      });

      const userPayload: UserPayload = {
        id: user.id,
        email: user.email,
        role: user.role as 'USER' | 'ADMIN',
        firstName: user.firstName,
        lastName: user.lastName
      };

      const token = this.generateToken(userPayload);
      const refreshToken = this.generateRefreshToken({ id: userPayload.id, email: userPayload.email, role: userPayload.role });

      return {
        user: userPayload,
        token,
        refreshToken,
      };
    } catch (error) {
      // If it's already a user-friendly error, re-throw it
      if (error instanceof Error && error.message.includes('User with this email already exists')) {
        throw error;
      }
      // For database connection errors or other technical errors, throw generic message
      throw new Error('Internal Server Error');
    }
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user || !user.isActive) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isValidPassword = await this.comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const userPayload: UserPayload = {
        id: user.id,
        email: user.email,
        role: user.role as 'USER' | 'ADMIN',
        firstName: user.firstName,
        lastName: user.lastName
      };

      const token = this.generateToken(userPayload);
      const refreshToken = this.generateRefreshToken({ id: userPayload.id, email: userPayload.email, role: userPayload.role });

      return {
        user: userPayload,
        token,
        refreshToken,
      };
    } catch (error) {
      // If it's already a user-friendly error, re-throw it
      if (error instanceof Error && error.message.includes('Invalid credentials')) {
        throw error;
      }
      // For database connection errors or other technical errors, throw generic message
      throw new Error('Internal Server Error');
    }
  }

  static async getUserFromToken(token: string): Promise<UserPayload | null> {
    try {
      const payload = this.verifyToken(token);
      if (!payload) return null;

      // Verify user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: payload.id }
      });

      if (!user || !user.isActive) return null;

      return payload;
    } catch {
      // For any database connection errors or other technical errors, return null
      return null;
    }
  }

  static refreshAccessToken(refreshToken: string): { token: string } | null {
    try {
      const payload = jwt.verify(refreshToken, REFRESH_SECRET) as Pick<UserPayload, 'id' | 'email' | 'role'> & { exp: number; iat: number };
      const newToken = this.generateToken({
        id: payload.id,
        email: payload.email,
        role: payload.role,
        firstName: '',
        lastName: ''
      } as UserPayload);
      return { token: newToken };
    } catch {
      return null;
    }
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Also check cookies
  const token = request.cookies.get('auth-token')?.value;
  return token || null;
}

export async function authenticateRequest(request: NextRequest): Promise<UserPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  return AuthService.getUserFromToken(token);
}

