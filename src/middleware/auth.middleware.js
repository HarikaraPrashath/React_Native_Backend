import jwt from "jsonwebtoken";
import User from "../model/user.js";

const protectRoute = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No authentication token, access denied" });
        }

        const token = authHeader.replace("Bearer ", "").trim();

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Token is not valid" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        return res.status(401).json({ message: "Token verification failed" });
    }
};

export default protectRoute;

