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

export const changeInfo = async (req, res) => {
    const { name, region } = req.body;
    
    // Додаткова перевірка на наявність даних
    if (!name && !region) {
        return res.status(400).json({ success: false, message: 'Надайте принаймні одне поле для оновлення (ім\'я або регіон)' });
    }

    try {
        // 1. Знаходимо існуючого користувача за ID
        // (req.userId має бути встановлено у middleware аутентифікації)
        let user = await userModel.findById(req.userId); // Використовуємо 'let' або 'const'

        if (!user) {
            return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
        }
        
        
        if (name) {
            user.name = name;
        }
        if (region) {
            user.region = region;
        }
        
        
        await user.save();
        
        res.status(200).json({ success: true, message: 'Інформацію оновлено успішно', user: { name: user.name, region: user.region, email: user.email } });
        
    } catch (error) {
        console.error('Помилка оновлення інформації користувача:', error);
        res.status(500).json({ success: false, message: 'Помилка оновлення інформації користувача', error: error.message });
    }
}






    
