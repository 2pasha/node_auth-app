import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user.js'
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

export const userService = {
  getAllActivated,
  normalize,
  findByEmail,
  register,
};