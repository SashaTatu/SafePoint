import webpush from 'web-push';

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
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    console.error("Помилка відправки Push:", error);
    // Тут можна видалити "мертві" підписки з бази, якщо error.statusCode === 410
  }
}

export default sendNotification;