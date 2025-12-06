import User from "../models/userModel.js";
import Device from "../models/deviceModel.js";
import checkRegionAlarm from "../services/alarmChecker.js";

export function startAlarmScheduler() {
  setInterval(async () => {
    console.log("🔄 Перевірка тривог...");

    const users = await User.find({}, { uid: 1 });

    for (const user of users) {
      const regionId = user.uid;
      if (!regionId) continue;

      const alarmStatus = await checkRegionAlarm(regionId);

      // 🔍 Визначаємо чи є тривога
      const isAlert =
        alarmStatus &&
        Array.isArray(alarmStatus.activeAlerts) &&
        alarmStatus.activeAlerts.length > 0;

      console.log(`UID ${regionId}: ALERT = ${isAlert}`);

      try {
        // 🔄 Оновлюємо alert у користувача
        await User.updateOne(
          { _id: user._id },
          { alert: isAlert }
        );
      } catch (error) {
        console.error(`❌ Помилка оновлення user.alert (${regionId}):`, error);
      }

      try {
        // 🔄 Оновлюємо alert у всіх пристроїв користувача
        const devices = await Device.find({ owner: user._id });
        for (const device of devices) {
          device.alert = isAlert;
          await device.save();
        }
      } catch (error) {
        console.error(`❌ Помилка оновлення device.alert (${regionId}):`, error);
      }
    }
  }, 120000);
}

export default startAlarmScheduler;
