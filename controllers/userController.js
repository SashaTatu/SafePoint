import userModel from '../models/userModel.js';

export const getUserData = async (req, res) => {

    try{

        const user = await userModel.findOne(req.userId);

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
        const { alertStatus } = req.body;
        const userId = req.userId;

        if (!alertStatus || alertStatus.length !== 28) {
            return res.status(400).json({ success: false, message: "Невірний формат alertStatus" });
        }

        const user = await userModel.findOne({ userId }); // ✅ правильно
        if (!user) {
            return res.status(404).json({ success: false, message: "Користувача не знайдено" });
        }

        const uid = user.uid;
        if (!uid) {
            return res.status(400).json({ success: false, message: "UID області не знайдено" });
        }

        const index = uid - 3;
        const letter = alertStatus[index];

        console.log(`alertStatus: ${alertStatus}`);
        console.log(`uid: ${uid}, index: ${index}, letter: ${letter}`);

        const alert = (letter === "A" || letter === "P");

        return res.json({
            success: true,
            uid,
            region: user.region,
            alert
        });

    } catch (error) {
        console.error("isAlert ERROR:", error.message);
        console.error(error.stack);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};




    
