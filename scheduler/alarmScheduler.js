import User from '../models/userModel.js';
import Device from '../models/deviceModel.js';
import checkRegionAlarm from '../services/alarmChecker.js';
import districtUID from '../config/DistrictUID.js';

export function startAlarmScheduler() {
  setInterval(async () => {
    console.log("🔄 Перевірка тривог...");

    try {
      // 1️⃣ Один запит до API
      const alarms = await checkRegionAlarm();

      if (!Array.isArray(alarms)) {
        console.warn("⚠️ Невалідна відповідь API");
        return;
      }

      // 2️⃣ Активні ОБЛАСНІ uid
      const activeRegionUids = new Set();

      for (const alarm of alarms) {
        if (alarm.active !== true || !alarm.regionId) continue;

        const regionUid = districtUID[String(alarm.regionId)];

        if (regionUid !== undefined) {
          activeRegionUids.add(regionUid);
        } else {
          console.warn(
            `⚠️ districtId ${alarm.regionId} не знайдено в districtUID`
          );
        }
      }

      // 3️⃣ Беремо тільки валідних користувачів
      const users = await User.find(
        { uid: { $exists: true, $ne: null } },
        { uid: 1 }
      );

      for (const user of users) {
        const isAlert = activeRegionUids.has(user.uid);

        console.log(`UID ${user.uid}: ALERT = ${isAlert}`);

        await User.updateOne(
          { _id: user._id },
          { alert: isAlert }
        );

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
