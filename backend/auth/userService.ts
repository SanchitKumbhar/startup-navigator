import bcryptjs from 'bcryptjs';
import mongoose, { Schema, model } from 'mongoose';
import { User } from './types';

interface UserDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  avatar: string;
  passwordHash: string;
  roleTitle?: string;
  skills: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

interface AuthAccountDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  provider: 'local' | 'google' | 'github' | 'microsoft';
  providerAccountId: string;
  passwordHash?: string | null;
  passwordAlgo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320, unique: true },
    avatar: { type: String, required: true, maxlength: 8 },
    passwordHash: { type: String, required: true, maxlength: 200 },
    roleTitle: { type: String, maxlength: 120 },
    skills: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'users' }
);

const authAccountSchema = new Schema<AuthAccountDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    provider: { type: String, required: true, enum: ['local', 'google', 'github', 'microsoft'] },
    providerAccountId: { type: String, required: true, maxlength: 320 },
    passwordHash: { type: String, default: null },
    passwordAlgo: { type: String, default: null },
  },
  { timestamps: true, collection: 'auth_accounts' }
);

authAccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const UserModel = mongoose.models.User || model<UserDocument>('User', userSchema);
const AuthAccountModel =
  mongoose.models.AuthAccount || model<AuthAccountDocument>('AuthAccount', authAccountSchema);

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toUser(userDoc: UserDocument, passwordHash: string): User {
  return {
    id: userDoc._id.toString(),
    email: userDoc.email,
    name: userDoc.name,
    password: passwordHash,
  };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  if (!hashedPassword) {
    return false;
  }
  return bcryptjs.compare(password, hashedPassword);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const normalizedEmail = normalizeEmail(email);

  const userDoc = await UserModel.findOne({
    email: normalizedEmail,
    isActive: true,
    $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
  }).lean<UserDocument | null>();

  if (!userDoc) {
    return undefined;
  }

  let passwordHash = userDoc.passwordHash;

  if (!passwordHash) {
    const accountDoc = await AuthAccountModel.findOne({
      userId: userDoc._id,
      provider: 'local',
    }).lean<AuthAccountDocument | null>();

    if (!accountDoc?.passwordHash) {
      return undefined;
    }

    passwordHash = accountDoc.passwordHash;

    await UserModel.updateOne(
      { _id: userDoc._id },
      { $set: { passwordHash } }
    );
  }

  return toUser(userDoc, passwordHash);
}

export async function getUserById(id: string): Promise<User | undefined> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return undefined;
  }

  const userDoc = await UserModel.findById(id).lean<UserDocument | null>();
  if (!userDoc || !userDoc.isActive || userDoc.deletedAt) {
    return undefined;
  }

  return {
    id: userDoc._id.toString(),
    email: userDoc.email,
    name: userDoc.name,
    password: '',
  };
}

export async function createUser(email: string, name: string, password: string): Promise<User> {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await getUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);

  const avatar = (name.trim().charAt(0) || normalizedEmail.charAt(0) || 'U').toUpperCase();
  const createdUser = await UserModel.create({
    name: name.trim(),
    email: normalizedEmail,
    avatar,
    passwordHash: hashedPassword,
    skills: [],
    isActive: true,
  });

  await AuthAccountModel.create({
    userId: createdUser._id,
    provider: 'local',
    providerAccountId: normalizedEmail,
    passwordHash: hashedPassword,
    passwordAlgo: 'bcrypt',
  });

  return {
    id: createdUser._id.toString(),
    email: createdUser.email,
    name: createdUser.name,
    password: hashedPassword,
  };
}

export async function getAllUsers(): Promise<User[]> {
  const userDocs = await UserModel.find({
    isActive: true,
    $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
  }).lean<UserDocument[]>();

  return userDocs.map((userDoc) => ({
    id: userDoc._id.toString(),
    email: userDoc.email,
    name: userDoc.name,
    password: '',
  }));
}
