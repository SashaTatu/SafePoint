import { checkRegionAlarm } from "../services/alarmChecker.js";
import userModel from "../models/userModel.js";

export function startAlarmScheduler() {
    setInterval(async () => {
        console.log("Перевіряю тривоги...");

        // Отримати всі унікальні регіони зареєстрованих користувачів
        const regions = await userModel.distinct("region");

        for (const region of regions) {
            const alarmStatus = await checkRegionAlarm(region);

            if (!alarmStatus) continue;

            // Зберегти в базу стан (наприклад у user.session або окрему колекцію)
            await userModel.updateMany(
                { region },
                { $set: { alarmStatus } }
            );

            console.log(`✔ Оновлено стан для ${region}:`, alarmStatus);
        }

    }, 30 * 1000); // 30 секунд
}

export default startAlarmScheduler;
