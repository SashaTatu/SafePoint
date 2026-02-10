import express from 'express';
import { getMyNotifications, deleteNotification } from '../controllers/notificationController.js';
import userAuth from '../middleware/userAuth.js';

const NotificationRouter = express.Router();


NotificationRouter.get('/', userAuth, getMyNotifications);
NotificationRouter.delete('/delete-all', userAuth, deleteNotification);

export default NotificationRouter;