import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, changeInfo, ShowAlertUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.put('/change-info', userAuth, changeInfo);
userRouter.get('/useralert', userAuth, ShowAlertUser);

export default userRouter;