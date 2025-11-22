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
        const { alertStatus } = req.body;  // "ANNNNNNNNNNNANNNNNNNNNNNNNN"
        const user = await userModel.findById(req.user.id);
        const uid = user.uid;         // uid беремо з JWT або бд

        if (!alertStatus || typeof alertStatus !== "string") {
            return res.status(400).json({ success: false, message: "Некоректний alertStatus" });
        }

        // Перевіряємо щоб індекс існував
        if (uid < 0 || uid >= alertStatus.length) {
            return res.status(400).json({ success: false, message: "uid виходить за межі alertStatus" });
        }

        // Беремо букву для конкретного uid
        const letter = alertStatus[uid];

        // Визначення статусу тривоги
        const alert = (letter === 'A' || letter === 'P');

        return res.json({ success: true, alert, letter });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Помилка перевірки тривоги" });
    }
};


    
