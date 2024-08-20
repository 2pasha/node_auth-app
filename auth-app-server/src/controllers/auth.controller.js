import { User } from '../models/user.js';
import { userService } from '../services/user.service.js';

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(
    name, email, password
  );

  await userService.register(name, email, password);

  res.send({ message: 'OK' });
};

const activate = async (req, res) => {
  const { activationToken } = req.params;

  const user = await User.findOne({
    where: { activationToken },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid activation token' });
  }

  user.activationToken = null;
  await user.save();

  res.status(200).json({ message: 'Account activated successfully' });
};

export const authController = { 
  register,
  activate,
};
