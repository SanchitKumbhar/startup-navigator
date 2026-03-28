"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongo = connectToMongo;
exports.getMongoConnection = getMongoConnection;
const mongoose_1 = __importDefault(require("mongoose"));
let connected = false;
async function connectToMongo() {
    if (connected) {
        return;
    }
    const mongoUri = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME || "startup_navigator";
    if (!mongoUri) {
        throw new Error("MONGO_URI is not set");
    }
    await mongoose_1.default.connect(mongoUri, { dbName });
    connected = true;
}
function getMongoConnection() {
    return mongoose_1.default.connection;
}
