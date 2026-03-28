"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_1 = require("./jwt");
function authMiddleware(req, res, next) {
    const token = (0, jwt_1.extractToken)(req.headers.authorization);
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    const payload = (0, jwt_1.verifyToken)(token);
    if (!payload) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
    req.auth = {
        userId: payload.userId,
        email: payload.email,
    };
    next();
}
