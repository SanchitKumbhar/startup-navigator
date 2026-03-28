"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.getUserByEmail = getUserByEmail;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320, unique: true },
    avatar: { type: String, required: true, maxlength: 8 },
    passwordHash: { type: String, required: true, maxlength: 200 },
    roleTitle: { type: String, maxlength: 120 },
    skills: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, collection: 'users' });
const authAccountSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    provider: { type: String, required: true, enum: ['local', 'google', 'github', 'microsoft'] },
    providerAccountId: { type: String, required: true, maxlength: 320 },
    passwordHash: { type: String, default: null },
    passwordAlgo: { type: String, default: null },
}, { timestamps: true, collection: 'auth_accounts' });
authAccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });
const UserModel = mongoose_1.default.models.User || (0, mongoose_1.model)('User', userSchema);
const AuthAccountModel = mongoose_1.default.models.AuthAccount || (0, mongoose_1.model)('AuthAccount', authAccountSchema);
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function toUser(userDoc, passwordHash) {
    return {
        id: userDoc._id.toString(),
        email: userDoc.email,
        name: userDoc.name,
        password: passwordHash,
    };
}
async function hashPassword(password) {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(password, salt);
}
async function comparePassword(password, hashedPassword) {
    if (!hashedPassword) {
        return false;
    }
    return bcryptjs_1.default.compare(password, hashedPassword);
}
async function getUserByEmail(email) {
    const normalizedEmail = normalizeEmail(email);
    const userDoc = await UserModel.findOne({
        email: normalizedEmail,
        isActive: true,
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    }).lean();
    if (!userDoc) {
        return undefined;
    }
    let passwordHash = userDoc.passwordHash;
    if (!passwordHash) {
        const accountDoc = await AuthAccountModel.findOne({
            userId: userDoc._id,
            provider: 'local',
        }).lean();
        if (!accountDoc?.passwordHash) {
            return undefined;
        }
        passwordHash = accountDoc.passwordHash;
        await UserModel.updateOne({ _id: userDoc._id }, { $set: { passwordHash } });
    }
    return toUser(userDoc, passwordHash);
}
async function getUserById(id) {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return undefined;
    }
    const userDoc = await UserModel.findById(id).lean();
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
async function createUser(email, name, password) {
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
async function getAllUsers() {
    const userDocs = await UserModel.find({
        isActive: true,
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    }).lean();
    return userDocs.map((userDoc) => ({
        id: userDoc._id.toString(),
        email: userDoc.email,
        name: userDoc.name,
        password: '',
    }));
}
