import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const userAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded._id;

        const user = await userModel.findById(userId); // тут userModel, не User
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        console.error("❌ Auth ERROR:", error);
        res.status(500).json({ success: false, message: "Auth error", error: error.message });
    }
};
export default userAuth;