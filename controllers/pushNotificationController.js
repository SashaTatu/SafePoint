import webpush from 'web-push';
import User from '../models/userModel.js';
import Device from '../models/deviceModel.js';
import checkRegionAlarm from '../services/alarmChecker.js';
import districtUID from '../config/DistrictUID.js';

// Налаштування web-push (краще винести в окремий конфіг)
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export function startAlarmScheduler() {
  setInterval(async () => {
    console.log("🔄 Перевірка тривог та розсилка...");

    try {
      const alarms = await checkRegionAlarm();
      if (!Array.isArray(alarms)) return;

      const activeRegionUids = new Set();
      for (const alarm of alarms) {
        const hasAlert = Array.isArray(alarm.activeAlerts) && alarm.activeAlerts.length > 0;
        if (hasAlert && alarm.regionId) {
          const regionUid = districtUID[String(alarm.regionId)];
          if (regionUid !== undefined) activeRegionUids.add(regionUid);
        }
      }

      // Отримуємо користувачів, які мають підписку
      const users = await User.find({ uid: { $exists: true } });

      for (const user of users) {
        const isAlertCurrently = activeRegionUids.has(user.uid);
        
        // 🚨 КЛЮЧОВИЙ МОМЕНТ: Перевіряємо, чи змінився статус
        // Якщо в базі було false, а стало true — надсилаємо пуш про ТРИВОГУ
        // Якщо було true, а стало false — надсилаємо пуш про ВІДБІЙ
        if (user.alert !== isAlertCurrently) {
          
          if (user.subscribeUser && user.subscribeUser.endpoint) {
            const title = isAlertCurrently ? "🔴 ПОВІТРЯНА ТРИВОГА" : "🟢 ВІДБІЙ ТРИВОГИ";
            const message = isAlertCurrently 
              ? `У вашому регіоні оголошено тривогу! Прямуйте в укриття.` 
              : `Відбій тривоги. Бережіть себе!`;

            const payload = JSON.stringify({
              title: title,
              body: message,
              url: 'https://safepoint-bei0.onrender.com'
            });

            webpush.sendNotification(user.subscribeUser, payload).catch(err => {
              console.error(`Помилка пуша для ${user.name}:`, err.statusCode);
            });
          }

          // Оновлюємо базу тільки після того, як визначили зміну
          await User.updateOne({ _id: user._id }, { alert: isAlertCurrently });
          
          await Device.updateMany(
            { owner: user._id },
            { $set: { alert: isAlertCurrently, status: isAlertCurrently } }
          );
        }
      }
    } catch (error) {
      console.error("❌ Scheduler error:", error);
    }
  }, 120_000); // 2 хвилини
}