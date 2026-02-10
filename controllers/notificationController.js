import Notification from '../models/notificationModel.js';


export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 }) // Спочатку найновіші
      .limit(20);              // Останні 20

    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default getMyNotifications;