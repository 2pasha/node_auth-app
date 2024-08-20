import express from 'express';
import { catchError } from '../utils/catchError.js';
import { authController } from '../controllers/auth.controller.js';

export const authRouter = new express.Router();

authRouter.post('/registration', catchError(authController.register));
authRouter.get('/activation/:activationToken', catchError(authController.activate));
