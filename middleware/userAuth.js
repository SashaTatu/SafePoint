import jwt from 'jsonwebtoken';

export const userAuth = async (req, res, next) => {
    try {
        console.log("🔐 userAuth middleware START");

        const token = req.headers.authorization?.split(" ")[1];
        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        // Підтримка різних форматів токена
        const userId = decoded.id || decoded._id;
        console.log("Extracted userId:", userId);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Token does not contain user ID"
            });
        }

        const user = await User.findById(userId);
        console.log("User:", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("❌ Auth ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Auth error",
            error: error.message
        });
    }
};

export default userAuth;