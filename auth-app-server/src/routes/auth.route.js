import express from 'express';
import { catchError } from '../utils/catchError.js';
import { authController } from '../controllers/auth.controller.js';

export const authRouter = new express.Router();

authRouter.post('/registration', catchError(authController.register));
authRouter.get('/activation/:activationToken', catchError(authController.activate));
authRouter.post('/login', catchError(authController.login));
authRouter.get('/refresh', catchError(authController.refresh));
authRouter.post('/logout', catchError(authController.logout));

authRouter.post('/request-password-reset', catchError(authController.requestPasswordReset));
authRouter.post('/reset-password', catchError(authController.resetPassword));

