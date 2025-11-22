import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail, verifyOtp, getUser } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.post('/is-au', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp',  sendResetOtp);
authRouter.post('/verify-otp',  verifyOtp);
authRouter.post('/reset-password',  resetPassword);
authRouter.get('/getuser', userAuth, getUser);

export default authRouter;