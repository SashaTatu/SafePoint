import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Неавторизовано (немає токена)" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId; // ✅ правильне поле

        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: "Невірний або прострочений токен" });
    }
};

export default userAuth;
