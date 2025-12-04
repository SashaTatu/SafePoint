import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, changeInfo, isAlert } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.put('/change-info', userAuth, changeInfo);
userRouter.post('/is-alert', userAuth, isAlert);

export default userRouter;