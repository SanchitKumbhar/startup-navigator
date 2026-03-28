import bcryptjs from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { User } from './types';

const USERS_FILE_PATH = path.join(__dirname, 'users.json');

// In-memory store backed by a local JSON file for persistence across restarts.
let users: Map<string, User> = new Map();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function loadUsersFromDisk(): void {
  if (!fs.existsSync(USERS_FILE_PATH)) {
    return;
  }

  try {
    const raw = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as User[];
    users = new Map(parsed.map((user) => [user.id, user]));
  } catch {
    users = new Map();
  }
}

function persistUsersToDisk(): void {
  const allUsers = Array.from(users.values());
  fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(allUsers, null, 2), 'utf-8');
}

loadUsersFromDisk();

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
  const normalizedEmail = normalizeEmail(email);
  return Array.from(users.values()).find((user) => normalizeEmail(user.email) === normalizedEmail);
}

export function getUserById(id: string): User | undefined {
  return users.get(id);
}

export async function createUser(email: string, name: string, password: string): Promise<User> {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = getUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);
  const userId = generateUserId();

  const user: User = {
    id: userId,
    email: normalizedEmail,
    name,
    password: hashedPassword,
  };

  users.set(userId, user);
  persistUsersToDisk();
  return user;
}

export function getAllUsers(): User[] {
  return Array.from(users.values());
}
