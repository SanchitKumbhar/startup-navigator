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
// In-memory user store (replace with database in production)
let users = new Map();
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
    return Array.from(users.values()).find((user) => user.email === email);
}
function getUserById(id) {
    return users.get(id);
}
async function createUser(email, name, password) {
    const existingUser = getUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await hashPassword(password);
    const userId = generateUserId();
    const user = {
        id: userId,
        email,
        name,
        password: hashedPassword,
    };
    users.set(userId, user);
    return user;
}
function getAllUsers() {
    return Array.from(users.values());
}
