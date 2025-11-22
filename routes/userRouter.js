import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, isAlert, userIsAlert } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.post('/is-alert', userAuth, isAlert);
userRouter.get('/isgetalert', userAuth, userIsAlert);

export default userRouter;