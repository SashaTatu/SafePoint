import User from "../models/userModel.js";
import checkRegionAlarm from "../services/alarmChecker.js";


export function startAlarmScheduler() {
  setInterval(async () => {
    console.log("🔄 Перевірка тривог...");

    const users = await User.find({}, { uid: 1 });

    for (const user of users) {
      const regionId = user.uid;

      if (!regionId) continue;

      const alarmStatus = await checkRegionAlarm(regionId);

      console.log(`UID ${regionId}:`, alarmStatus);

      
    }
  }, 120000);
}

export default startAlarmScheduler;