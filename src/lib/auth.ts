import jwt from 'jsonwebtoken';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  uid: string;
  username?: string;
  createdAt?: string;
  email?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'skn_secret_change_me';

/**
 * Create JWT token for user
 */
export function createAuthToken(userData: AuthUser): string {
  return jwt.sign(userData, JWT_SECRET, { expiresIn: '30d' });
}

/**
 * Get user role by checking uid against ADMIN_ID
 */
export function getUserRole(uid: string): UserRole {
  return uid === process.env.ADMIN_ID ? 'admin' : 'user';
}

/**
 * Verify and decode JWT token
 */
export function verifyAuthToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
} 