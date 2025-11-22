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
        console.log("🔍 isAlert controller START");
        console.log("User from token:", req.user);

        const userId = req.user._id;
        console.log("Extracted userId:", userId);

        const user = await User.findById(userId);
        console.log("Found user:", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Користувача не знайдено"
            });
        }

        // тут твоя логіка

        res.json({
            success: true,
            message: "OK"
        });

    } catch (error) {
        console.error("❌ ERROR in isAlert:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};



    
