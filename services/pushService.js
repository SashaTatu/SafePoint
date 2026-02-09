import webpush from 'web-push';

// Ключі треба згенерувати один раз (web-push generate-vapid-keys)
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function sendNotification(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    console.error("Помилка відправки Push:", error);
    // Тут можна видалити "мертві" підписки з бази, якщо error.statusCode === 410
  }
}

export default sendNotification;