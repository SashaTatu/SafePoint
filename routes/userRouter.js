import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, changeInfo } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.put('/change-info', userAuth, changeInfo);

export default userRouter;