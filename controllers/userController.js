import userModel from '../models/userModel.js';

export const getUserData = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId); // ✅ правильний пошук

        if (!user) {
            return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
        }

        res.status(200).json({
            success: true,
            userData: {
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Помилка отримання даних користувача', error });
    }
}


export const isAlert = async (req, res) => {
    try {
        const { uid } = req.body;
        const userId = req.userId;

        if (!uid) {
            return res.status(400).json({
                success: false,
                message: "uid обов’язковий"
            });
        }

        // Знайти користувача
        const user = await userModel.findOne({ userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Користувача не знайдено"
            });
        }

        
        const response = await fetch("https://api.ukrainealarm.com/api/v3/alerts", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.ALERT_API_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        // 2️⃣ Шукаємо регіон з таким uid (regionId)
        const region = regions.find(r => r.regionId == uid);

        if (!region) {
            return res.status(404).json({
                success: false,
                message: "Область з таким uid не знайдена"
            });
        }

        // 3️⃣ Перевіряємо чи є актвна повітряна тривога
        const hasAirAlert = region.activeAlerts.some(a => a.type === "AIR");

        // 4️⃣ Оновлюємо користувача
        user.alert = hasAirAlert;
        user.region = uid;
        await user.save();

        return res.json({
            success: true,
            uid,
            region: region.regionName,
            alert: hasAirAlert
        });

    } catch (error) {
        console.error("isAlert ERROR:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};





    
