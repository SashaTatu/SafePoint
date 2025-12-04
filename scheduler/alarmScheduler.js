import User from "../models/userModel.js";
import { checkRegionAlarm } from "../services/alarmChecker.js";

export function startAlarmScheduler() {
    setInterval(async () => {
        try {
            const users = await User.find();

            for (const user of users) {
                const alarmData = await checkRegionAlarm(user.region);

                if (alarmData?.active !== undefined) {
                    user.alert = alarmData.active; 
                    await user.save();
                }
            }

            console.log("Синхронізація тривог завершена");
        } catch (err) {
            console.error("Помилка в scheduler:", err);
        }
    }, 30000); // 30 секунд
}

export default startAlarmScheduler;