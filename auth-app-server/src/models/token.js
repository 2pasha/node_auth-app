import { client } from '../utils/db.js';
import { DataTypes } from 'sequelize'
import { User } from './user.js';

export const Token = client.define(
  'token',
  {
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }
);

Token.belongsTo(User);
User.hasOne(Token);
