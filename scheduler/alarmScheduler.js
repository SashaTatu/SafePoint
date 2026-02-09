import User from '../models/userModel.js';
import Device from '../models/deviceModel.js';
import checkRegionAlarm from '../services/alarmChecker.js';
import districtUID from '../config/DistrictUID.js';
import { sendNotification } from '../services/pushService.js';
import 'dotenv/config';

export function startAlarmScheduler() {
  console.log("🚀 Scheduler ініціалізовано. Перевірка кожні 120с.");

  setInterval(async () => {
    const startTime = Date.now();
    console.log(`\n--- 🔄 Цикл перевірки розпочато: ${new Date().toLocaleTimeString()} ---`);

    try {
      const alarms = await checkRegionAlarm();
      
      if (!Array.isArray(alarms)) {
        console.error("❌ Помилка: API тривог повернуло не масив.");
        return;
      }

      const activeRegionUids = new Set();
      for (const alarm of alarms) {
        if (!alarm.regionId) continue;
        const hasAlert = Array.isArray(alarm.activeAlerts) && alarm.activeAlerts.length > 0;
        if (hasAlert) {
          const regionUid = districtUID[String(alarm.regionId)];
          if (regionUid !== undefined) activeRegionUids.add(regionUid);
        }
      }

      console.log(`📊 Активні регіони (UID): ${activeRegionUids.size > 0 ? Array.from(activeRegionUids).join(', ') : 'Немає'}`);

      // Знаходимо всіх користувачів, які мають UID (територіальну прив'язку)
      const users = await User.find(
        { uid: { $exists: true, $ne: null } },
        { uid: 1, alert: 1, subscribeUser: 1 }
      );

      console.log(`👥 Оброблено користувачів з бази: ${users.length}`);

      let updatedCount = 0;
      let pushSentCount = 0;

      for (const user of users) {
        const isAlertNow = activeRegionUids.has(user.uid);

        // Якщо статус не змінився — нічого не робимо
        if (user.alert === isAlertNow) continue;

        updatedCount++;
        const statusText = isAlertNow ? "🔴 ТРИВОГА" : "🟢 ВІДБІЙ";
        console.log(`🔔 [UID: ${user.uid}] Зміна статусу: ${user.alert} -> ${isAlertNow} (${statusText})`);

        // 1. Оновлюємо статус в БД синхронно для цього юзера
        await User.updateOne({ _id: user._id }, { alert: isAlertNow });
        await Device.updateMany({ owner: user._id }, { $set: { alert: isAlertNow, status: isAlertNow } });

        // 2. Відправка Push-повідомлення
        if (user.subscribeUser && user.subscribeUser.endpoint) {
          const payload = {
            title: isAlertNow ? "🔴 ПОВІТРЯНА ТРИВОГА!" : "🟢 ВІДБІЙ ТРИВОГИ",
            body: isAlertNow 
              ? "Терміново пройдіть в укриття!" 
              : "Загроза минула. Гарного дня!",
            icon: "/frontend/assets/icons/192x192.png",
            badge: "/frontend/assets/icons/128x128.png",
            tag: "alert-status",
            data: { url: "/" } 
          };

          sendNotification(user.subscribeUser, payload)
            .then(() => {
              // console.log(`✅ Push доставлено для ${user._id}`);
            })
            .catch(err => {
              console.error(`❌ Помилка Push для юзера ${user._id}:`, err.message);
            });
          
          pushSentCount++;
        } else {
          console.warn(`⚠️ Юзер ${user._id} змінив статус, але не має підписки на Push`);
        }
      }

      const duration = Date.now() - startTime;
      console.log(`✅ Цикл завершено за ${duration}ms. Оновлено статусів: ${updatedCount}, Відправлено Push: ${pushSentCount}`);
      
    } catch (error) {
      console.error("❌ КРИТИЧНА ПОМИЛКА ШЕДУЛЕРА:", error);
    }
  }, 120_000);
}

export default startAlarmScheduler;
