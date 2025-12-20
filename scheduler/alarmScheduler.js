import User from '../models/userModel.js';
import Device from '../models/deviceModel.js';
import checkRegionAlarm from '../services/alarmChecker.js';
import districtUID from '../config/DistrictUID.js';

export function startAlarmScheduler() {
  setInterval(async () => {
    console.log("🔄 Перевірка тривог...");

    try {
      // 1️⃣ ОДИН запит до API
      const alarms = await checkRegionAlarm();

      if (!Array.isArray(alarms)) {
        console.warn("⚠️ Невалідна відповідь від API");
        return;
      }

      // 2️⃣ Збираємо ВНУТРІШНІ uid з активною тривогою
      const activeInternalUids = new Set();

      for (const alarm of alarms) {
        if (!alarm.regionId || alarm.active !== true) continue;

        const internalUid = regionMap[alarm.regionId];

        if (internalUid) {
          activeInternalUids.add(internalUid);
        }
      }

      // 3️⃣ Отримуємо всіх користувачів
      const users = await User.find({}, { uid: 1 });

      for (const user of users) {
        const isAlert = activeInternalUids.has(user.uid);

        console.log(`UID ${user.uid}: ALERT = ${isAlert}`);

        // 4️⃣ User
        await User.updateOne(
          { _id: user._id },
          { alert: isAlert }
        );

        // 5️⃣ Devices
        await Device.updateMany(
          { owner: user._id },
          { alert: isAlert }
        );
      }

    } catch (error) {
      console.error("❌ Scheduler error:", error);
    }
  }, 120_000);
}

export default startAlarmScheduler;
