import express from 'express';
import { getMyNotifications } from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const NotificationRouter = express.Router();


NotificationRouter.get('/', authMiddleware, getMyNotifications);

export default NotificationRouter;