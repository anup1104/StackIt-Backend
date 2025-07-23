const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.authenticateUser = async (req, res, next) => {
    // const authHeader = req.headers.authorization || req.cookies.Authorization;

    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //     return res.status(401).json({
    //         success: false,
    //         message: "Unauthorized: No token provided",
    //     });
    // }

    // const token = authHeader.split(" ")[1];

    try {
    //     const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    //     const user = await User.findById(decoded.id);
    //     if (!user) {
    //         return res.status(401).json({
    //             success: false,
    //             message: "Unauthorized: User no longer exists",
    //         });
    //     }

    //     req.user = {
    //         userId: decoded.id,
    //         email: decoded.email,
    //     };

        next();
    } catch (error) {
        console.error("Authentication error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token expired",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token",
        });
    }
};
