import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Op } from 'sequelize';

import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user.js';
import { Token } from '../models/token.js';
import { ApiError } from '../exceptions/api.error.js';
import { emailService } from './email.service.js';

function getAllActivated() {
  return User.findAll({
    where: {
      activationToken: null,
    },
  });
}

function normalize({ id, email }) {
  return { id, email };
}

function findByEmail(email) {
  return User.findOne({ where: { email } });
}

async function register(name, email, password) {
  const activationToken = uuidv4();

  const existUser = await findByEmail(email);

  if (existUser) {
    throw ApiError.badRequest(
      'User already registered',
      {
        email: 'User already exists'
      },
    )
  }

  await User.create({
    name,
    email,
    password,
    activationToken
   });

   await emailService.sendActivationEmail(name, email, activationToken);
}

async function initiatePasswordReset(email) {
  const user = await findByEmail(email);

  if (!user) {
    throw ApiError.badRequest(
      'No such user',
      {
        email: 'No such email'
      },
    )
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetTokenExpiry = Date.now() + 3600000;

  const [token, created] = await Token.findOrCreate({
    where: { userId: user.id },
    defaults: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    }
  });

  if (!created) {
    await token.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry
    });
  }

  await emailService.sendPasswordResetEmail(
    user.name,
    user.email,
    resetToken,
  )
}

async function resetPassword(token, newPassword) {
  const user = await Token.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { [Op.gt]: new Date() }
    },
    include: [User]
  });

  if (!user) {
    throw ApiError.badRequest('Password reset token is invalid or has expired.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
}

export const userService = {
  getAllActivated,
  normalize,
  findByEmail,
  register,
  initiatePasswordReset,
  resetPassword,
};
