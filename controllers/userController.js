import userModel from '../models/userModel.js';

export const getUserData = async (req, res) => {

    try{

        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
        }

        res.status(200).json({
            success: true,
            userData : {
                name: user.name
                }
        });
    }catch (error) {
        res.status(500).json({ success: false, message: 'Помилка отримання даних користувача', error });
    }

}

export const isAlert = async (req, res) => {
    try {
        const { alertStatus } = req.body; // "ANNNNNNNNNNNANNNNNNNNNNNNNN"
        const userId = req.user.id; // або req.params.id (поки скажи, як ти хочеш)

        if (!alertStatus || alertStatus.length !== 27) {
            return res.status(400).json({ success: false, message: "Невірний формат alertStatus" });
        }

        // 1. Дістати користувача
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Користувача не знайдено" });
        }

        // 2. Дістати uid області
        const uid = regionToUid[user.region]; // приклад: 18 → Одеська область

        if (!uid) {
            return res.status(400).json({ success: false, message: "UID області не знайдено" });
        }

        // 3. Отримуємо букву по індексу (uid - 3!)
        const index = uid - 3; // бо масив стартує з 3
        const letter = alertStatus[index];

        const alert =
            letter === "A" || letter === "P"
                ? true
                : false;

        return res.json({
            success: true,
            uid,
            region: user.region,
            alert
        });

    } catch (error) {
        console.error("isAlert ERROR:", error);
        return res.status(500).json({ success: false, message: "Server error", error });
    }
};


    
