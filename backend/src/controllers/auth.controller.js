import { env } from '../config/env.js';
import { userRoles } from '../constants/user-roles.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/api-error.js';
import { sendSuccess } from '../utils/api-response.js';
import { httpStatus } from '../utils/http-status.js';
import { signAccessToken } from '../utils/jwt.js';

const buildAuthPayload = (user) => ({
  user: user.toJSON(),
  token: signAccessToken(user),
});

export const signup = async (req, res) => {
  const { name, email, password } = req.validated.body;

  const existingUser = await User.exists({ email });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, 'An account with this email already exists');
  }

  const passwordHash = await User.hashPassword(password);
  const userCount = await User.estimatedDocumentCount();
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: env.FIRST_USER_ADMIN && userCount === 0 ? userRoles.ADMIN : userRoles.MEMBER,
  });

  return sendSuccess(res, {
    statusCode: httpStatus.CREATED,
    message: 'Account created successfully',
    data: buildAuthPayload(user),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.validated.body;

  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  const isPasswordValid = await user.verifyPassword(password);

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  return sendSuccess(res, {
    message: 'Logged in successfully',
    data: buildAuthPayload(user),
  });
};

export const getCurrentUser = async (req, res) =>
  sendSuccess(res, {
    message: 'Current user fetched successfully',
    data: {
      user: req.user.toJSON(),
    },
  });

export const logout = async (_req, res) =>
  sendSuccess(res, {
    message: 'Logged out successfully',
    data: {
      instruction: 'Remove the access token from frontend storage.',
    },
  });
