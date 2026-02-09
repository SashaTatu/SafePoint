import webpush from 'web-push';
import User from './models/userModel.js'; // Ваша модель

// Налаштування web-push (зробіть це один раз)
webpush.setVapidDetails(
    'mailto:your-email@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Головна функція розсилки
export const triggerAlert = async (regionName, isAlarm) => {
    const title = isAlarm ? '🔴 ПОВІТРЯНА ТРИВОГА!' : '🟢 ВІДБІЙ ТРИВОГИ';
    const body = isAlarm 
        ? `У ${regionName} області оголошено тривогу! Прямуйте в укриття.` 
        : `У ${regionName} області відбій. Бережіть себе!`;
    const url = 'https://safepoint-bei0.onrender.com'; // Куди веде клік

    try {
        // Знаходимо всіх активних підписників у конкретному регіоні
        const subscribers = await User.find({
            region: regionName.toLowerCase(), // напр. 'zhytomyrska'
            alert: true,
            'subscribeUser.endpoint': { $exists: true }
        });

        const notifications = subscribers.map(user => {
            const payload = JSON.stringify({ title, body, url });
            
            return webpush.sendNotification(user.subscribeUser, payload)
                .catch(async (err) => {
                    if (err.statusCode === 410) {
                        // Якщо підписка прострочена, видаляємо її
                        await User.findByIdAndUpdate(user._id, { $unset: { subscribeUser: "" }, alert: false });
                    }
                });
        });

        await Promise.all(notifications);
        console.log(`Надіслано сповіщень: ${subscribers.length}`);
    } catch (error) {
        console.error('Помилка тригера:', error);
    }
};

export default sendPushToRegion;