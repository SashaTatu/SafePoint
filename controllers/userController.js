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

