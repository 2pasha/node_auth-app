import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { catchError } from '../utils/catchError.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const userRouter = new express.Router();

userRouter.get('/', authMiddleware, catchError(userController.getAllActivated));
