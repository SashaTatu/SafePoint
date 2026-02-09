import express from 'express';
import { getMyNotifications } from '../controllers/notificationController.js';
import userAuth from '../middleware/userAuth.js';

const NotificationRouter = express.Router();


NotificationRouter.get('/', userAuth, getMyNotifications);

export default NotificationRouter;