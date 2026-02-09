import User from '../models/userModel.js';
import Device from '../models/deviceModel.js';
import checkRegionAlarm from '../services/alarmChecker.js';
import districtUID from '../config/DistrictUID.js';
import { sendNotification } from '../services/pushService.js';
import 'dotenv/config'; 

export function startAlarmScheduler() {
  setInterval(async () => {
    console.log("🔄 Перевірка тривог...");

    try {
      const alarms = await checkRegionAlarm();
      if (!Array.isArray(alarms)) return;

      const activeRegionUids = new Set();
      for (const alarm of alarms) {
        if (!alarm.regionId) continue;
        const hasAlert = Array.isArray(alarm.activeAlerts) && alarm.activeAlerts.length > 0;
        if (hasAlert) {
          const regionUid = districtUID[String(alarm.regionId)];
          if (regionUid !== undefined) activeRegionUids.add(regionUid);
        }
      }

      // Отримуємо юзерів з підпискою
      const users = await User.find(
        { uid: { $exists: true, $ne: null } },
        { uid: 1, alert: 1, subscription: 1 } 
      );

      for (const user of users) {
        const isAlertNow = activeRegionUids.has(user.uid);

        if (user.alert === isAlertNow) continue;

        console.log(`🔔 UID ${user.uid}: Статус змінено на ${isAlertNow}`);

        // 1. Оновлюємо статус в БД
        await User.updateOne({ _id: user._id }, { alert: isAlertNow });
        
        // Оновлюємо девайси (якщо це поле вам ще потрібне для фронтенда)
        await Device.updateMany({ owner: user._id }, { $set: { alert: isAlertNow, status: isAlertNow } });

        // 2. Відправка Push-повідомлення
        if (user.subscribeUser && user.subscribeUser.endpoint) {
          const payload = {
            title: isAlertNow ? "🔴 ПОВІТРЯНА ТРИВОГА!" : "🟢 ВІДБІЙ ТРИВОГИ",
            body: isAlertNow 
              ? "Терміново пройдіть в укриття!" 
              : "Загроза минула. Гарного дня!",
            icon: "/frontend/assets/icons/192x192.png", // вкажіть ваш шлях
            badge: "/frontend/assets/icons/128x128.png",  // маленька іконка для Android статус-бару
            tag: "alert-status",  // щоб нові повідомлення замінювали старі, а не спамили
          };

          // Викликаємо функцію відправки (не чекаємо на await, щоб не гальмувати цикл)
          sendNotification(user.subscribeUser, payload).catch(err => 
            console.error(`Помилка Push для ${user._id}:`, err)
          );
        }
      }
    } catch (error) {
      console.error("❌ Scheduler error:", error);
    }
  }, 120_000); // Рекомендую зменшити інтервал до 30с для критичних сповіщень
}
export default startAlarmScheduler;
