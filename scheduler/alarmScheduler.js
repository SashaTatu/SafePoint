import User from "../models/userModel.js";
import checkRegionAlarm from "../services/alarmChecker.js";


export function startAlarmScheduler() {
  setInterval(async () => {
    console.log("🔄 Перевірка тривог...");

    const users = await User.find({}, { uid: 1 }); // беремо тільки uid

    for (const user of users) {
      const regionId = user.uid;

      if (!regionId) continue;

      const alarmStatus = await checkRegionAlarm(regionId);

      console.log(`UID ${regionId}:`, alarmStatus);

      // тут можеш зберегти в базу, якщо потрібно:
      // await AlarmLog.create({ regionId, status: alarmStatus });
    }
  }, 30000);
}

export default startAlarmScheduler;