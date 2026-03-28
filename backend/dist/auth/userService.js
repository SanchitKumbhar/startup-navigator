"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateUserId = generateUserId;
exports.getUserByEmail = getUserByEmail;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const USERS_FILE_PATH = path_1.default.join(__dirname, 'users.json');
// In-memory store backed by a local JSON file for persistence across restarts.
let users = new Map();
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function loadUsersFromDisk() {
    if (!fs_1.default.existsSync(USERS_FILE_PATH)) {
        return;
    }
    try {
        const raw = fs_1.default.readFileSync(USERS_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        users = new Map(parsed.map((user) => [user.id, user]));
    }
    catch {
        users = new Map();
    }
}
function persistUsersToDisk() {
    const allUsers = Array.from(users.values());
    fs_1.default.writeFileSync(USERS_FILE_PATH, JSON.stringify(allUsers, null, 2), 'utf-8');
}
loadUsersFromDisk();
async function hashPassword(password) {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(password, salt);
}
async function comparePassword(password, hashedPassword) {
    return bcryptjs_1.default.compare(password, hashedPassword);
}
function generateUserId() {
    return 'user_' + Math.random().toString(36).substring(2, 15);
}
function getUserByEmail(email) {
    const normalizedEmail = normalizeEmail(email);
    return Array.from(users.values()).find((user) => normalizeEmail(user.email) === normalizedEmail);
}
function getUserById(id) {
    return users.get(id);
}
async function createUser(email, name, password) {
    const normalizedEmail = normalizeEmail(email);
    const existingUser = getUserByEmail(normalizedEmail);
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await hashPassword(password);
    const userId = generateUserId();
    const user = {
        id: userId,
        email: normalizedEmail,
        name,
        password: hashedPassword,
    };
    users.set(userId, user);
    persistUsersToDisk();
    return user;
}
function getAllUsers() {
    return Array.from(users.values());
}
