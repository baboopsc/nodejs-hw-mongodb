import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import { sendMail } from '../utils/sendMail.js';

const ACCESS_TOKEN_TTL = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60 * 1000;

export const registerUser = async (payload) => {
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
        throw createHttpError(409, 'Email in use');
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    return User.create({ ...payload, password: hashedPassword });
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(401, 'Email or password is incorrect');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createHttpError(401, 'Email or password is incorrect');
    }
    await Session.deleteOne({ userId: user._id });
    return Session.create({
        userId: user._id,
        accessToken: randomBytes(30).toString('base64'),
        refreshToken: randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
        refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
    const session = await Session.findOne({ _id: sessionId, refreshToken });
    if (!session) {
        throw createHttpError(401, 'Session not found');
    }
    if (session.refreshTokenValidUntil < new Date()) {
        throw createHttpError(401, 'Refresh token is expired');
    }
    await Session.deleteOne({ _id: sessionId });
    return Session.create({
        userId: session.userId,
        accessToken: randomBytes(30).toString('base64'),
        refreshToken: randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
        refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
};

export const logoutUser = async ({ sessionId, refreshToken }) => {
    await Session.deleteOne({ _id: sessionId, refreshToken });
};

export const sendResetEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    try {
        await sendMail({
            to: email,
            subject: 'Password Reset',
            html: `<p>Click the link below to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>This link will expire in 5 minutes.</p>`,
        });
    } catch {
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
};

export const resetPassword = async ({ token, password }) => {
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        throw createHttpError(401, 'Token is expired or invalid.');
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    await Session.deleteOne({ userId: user._id });
};