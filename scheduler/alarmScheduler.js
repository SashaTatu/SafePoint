import User from '../models/userModel.js';
import Device from '../models/deviceModel.js';
import checkRegionAlarm from '../services/alarmChecker.js';
import districtUID from '../config/DistrictUID.js';

export function startAlarmScheduler() {
  setInterval(async () => {
    console.log("🔄 Перевірка тривог...");

    try {
      const alarms = await checkRegionAlarm();

      if (!Array.isArray(alarms)) {
        console.warn("⚠️ Невалідна відповідь API");
        return;
      }

      // ✅ Збираємо Set активних UID, де зараз є тривога
      const activeRegionUids = new Set();
      for (const alarm of alarms) {
        if (!alarm.regionId) continue;
        const hasAlert = Array.isArray(alarm.activeAlerts) && alarm.activeAlerts.length > 0;
        
        if (hasAlert) {
          const regionUid = districtUID[String(alarm.regionId)];
          if (regionUid !== undefined) activeRegionUids.add(regionUid);
        }
      }

      // Отримуємо користувачів, включаючи їхній поточний статус 'alert'
      const users = await User.find(
        { uid: { $exists: true, $ne: null } },
        { uid: 1, alert: 1 }
      );

      for (const user of users) {
        const isAlertNow = activeRegionUids.has(user.uid);

        // 🚀 ПЕРЕВІРКА: Якщо статус не змінився — пропускаємо ітерацію
        if (user.alert === isAlertNow) {
          // console.log(`UID ${user.uid}: Статус не змінився (${isAlertNow}). Пропускаємо.`);
          continue;
        }

        // Якщо статус змінився — оновлюємо
        console.log(`🔔 UID ${user.uid}: Зміна статусу! ALERT = ${isAlertNow}`);

        await User.updateOne(
          { _id: user._id },
          { alert: isAlertNow }
        );

        await Device.updateMany(
          { owner: user._id },
          { $set: { alert: isAlertNow, status: isAlertNow } }
        );
      }

    } catch (error) {
      console.error("❌ Scheduler error:", error);
    }
  }, 120_000);
}

export default startAlarmScheduler;
