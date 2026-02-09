import webpush from 'web-push';
import 'dotenv/config';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

const publicKey = process.env.publicKey;
const privateKey = process.env.privateKey;

if (!publicKey || !privateKey) {
  console.error('❌ Помилка: VAPID ключі не знайдені в process.env!');
} else {
  webpush.setVapidDetails(
    'mailto:your-email@example.com',
    publicKey,
    privateKey
  );
  console.log('✅ Web-Push успішно налаштовано');
}

export async function sendNotification(subscription, payload) {
  try {
    const response = await webpush.sendNotification(subscription, JSON.stringify(payload));
    return response;
  } catch (error) {
    console.error(`❌ Помилка відправки Push (Status: ${error.statusCode}):`);
    
    // Якщо підписка недійсна (користувач видалив додаток або відкликав дозвіл)
    if (error.statusCode === 410 || error.statusCode === 404) {
      console.warn('🗑️ Підписка застаріла. Рекомендується видалити її з бази.');
      // Тут можна додати логіку очищення: 
      // await User.updateOne({ "subscribeUser.endpoint": subscription.endpoint }, { $unset: { subscribeUser: "" } });
    }
    throw error;
  }
}

/**
 * Комплексна функція: Зберігає сповіщення в БД та відправляє Push
 * @param {Object} user - Об'єкт користувача з бази (має містити _id та subscribeUser)
 * @param {Object} payload - Дані для сповіщення (title, body, icon, tag, data)
 * @param {String} type - Тип для історії ('alert', 'temp', 'co2', 'humi')
 */
export async function sendAndSaveNotification(user, payload, type) {
  try {
    // 1. Зберігаємо в історію для "дзвіночка"
    await Notification.create({
      userId: user._id,
      title: payload.title,
      body: payload.body,
      type: type,
      isRead: false,
      createdAt: new Date()
    });
    console.log(`💾 Історія оновлена для користувача ${user._id} (тип: ${type})`);

    // 2. Відправляємо реальний Push, якщо є підписка
    if (user.subscribeUser && user.subscribeUser.endpoint) {
      await sendNotification(user.subscribeUser, payload);
      console.log(`📡 Push-повідомлення надіслано успішно`);
    } else {
      console.warn(`⚠️ У користувача ${user._id} відсутня активна Push-підписка`);
    }

  } catch (error) {
    console.error('❌ Помилка в sendAndSaveNotification:', error.message);
  }
}

export default {
  sendNotification,
  sendAndSaveNotification
};