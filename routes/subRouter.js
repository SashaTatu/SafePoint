import express from 'express';
import createSubscription from '../controllers/subController.js';
import userAuth from '../middleware/userAuth.js';

const subRouter = express.Router({ mergeParams: true });

subRouter.post('/', userAuth, createSubscription);

export default subRouter;