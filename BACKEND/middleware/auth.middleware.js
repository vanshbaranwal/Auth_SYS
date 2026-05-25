import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isLoggedIn = async(req, res, next) => {
    try {
        console.log(req.cookies);
        let token = req.cookies?.token // ? is for optional chainning ki if aagar cookies ke ander token h to send it to me otherwise it will be empty
        
        console.log("token found : ", token? "yes" : "no");

        if(!token){
            console.log("no token");
            return res.status(401).json({
                success: false,
                message: "authentication failed"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded data : ", decoded);

        req.user= decoded;

        next();

    } catch (error) {
        console.log("auth middleware failure");
        return res.status(500).json({
            success: false,
            message: "internal server error"
        }); 

    }

};