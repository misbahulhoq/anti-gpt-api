"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtPayload = exports.decodeJwtToken = exports.verifyJwtToken = exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const generateJwtToken = (payload, expiresIn, secret) => {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: expiresIn });
};
exports.generateJwtToken = generateJwtToken;
const verifyJwtToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyJwtToken = verifyJwtToken;
const decodeJwtToken = (token) => {
    return jsonwebtoken_1.default.decode(token);
};
exports.decodeJwtToken = decodeJwtToken;
const getJwtPayload = (token) => {
    return jsonwebtoken_1.default.decode(token);
};
exports.getJwtPayload = getJwtPayload;
//# sourceMappingURL=jwt.js.map