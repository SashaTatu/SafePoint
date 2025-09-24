import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Немає токена" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode?.id) {
            req.userId = tokenDecode.id; // зберігаємо у req, а не body
            return next();
        } else {
            return res.status(403).json({ success: false, message: "Недійсний токен" });
        }

    } catch (error) {
        return res.status(403).json({ success: false, message: "Недійсний токен" });
    }
};

export default userAuth;
