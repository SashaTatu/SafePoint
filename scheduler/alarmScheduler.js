import User from '../models/userModel.js';
import Device from '../models/deviceModel.js';
import  checkRegionAlarm from '../services/alarmChecker.js';

export function startAlarmScheduler() {
  setInterval(async () => {
    console.log("🔄 Перевірка тривог...");

    const users = await User.find({}, { uid: 1 });

    for (const user of users) {
      const regionId = user.uid;
      if (!regionId) continue;

      const alarmStatus = await checkRegionAlarm(regionId);

      // Якщо функція повертає масив — беремо перший елемент
      const regionData = Array.isArray(alarmStatus)
        ? alarmStatus[0]
        : alarmStatus;

      const isAlert =
        regionData?.activeAlerts &&
        regionData.activeAlerts.length > 0;

      console.log(`UID ${regionId}: ALERT = ${isAlert}`);

      try {
        await User.updateOne(
          { _id: user._id },
          { alert: isAlert }
        );
      } catch (error) {
        console.error(`❌ Помилка оновлення user.alert (${regionId}):`, error);
      }

      try {
        await Device.updateMany(
          { owner: user._id },
          { alert: isAlert }
        );
      } catch (error) {
        console.error(`❌ Помилка оновлення device.alert (${regionId}):`, error);
      }
    }
  }, 120000);
}

export default startAlarmScheduler;