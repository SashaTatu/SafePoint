import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, isAlert, } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.post('/is-alert', isAlert);


export default userRouter;