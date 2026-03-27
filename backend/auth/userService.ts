import bcryptjs from 'bcryptjs';
import { User } from './types';

// In-memory user store (replace with database in production)
let users: Map<string, User> = new Map();

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcryptjs.compare(password, hashedPassword);
}

export function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substring(2, 15);
}

export function getUserByEmail(email: string): User | undefined {
  return Array.from(users.values()).find((user) => user.email === email);
}

export function getUserById(id: string): User | undefined {
  return users.get(id);
}

export async function createUser(email: string, name: string, password: string): Promise<User> {
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);
  const userId = generateUserId();

  const user: User = {
    id: userId,
    email,
    name,
    password: hashedPassword,
  };

  users.set(userId, user);
  return user;
}

export function getAllUsers(): User[] {
  return Array.from(users.values());
}
