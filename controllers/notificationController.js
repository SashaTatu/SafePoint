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

export const deleteNotification = async (req, res) => {
  try {
        // Використовуємо req.userId, як у твоєму middleware
        const result = await Notification.deleteMany({ userId: req.userId });
        
        res.json({ 
            success: true, 
            message: `Видалено сповіщень: ${result.deletedCount}` 
        });
    } catch (err) {
        console.error("❌ Помилка при видаленні з БД:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};


export default { getMyNotifications, deleteNotification };