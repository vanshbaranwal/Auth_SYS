import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { profile } from "console";
import { text } from "stream/consumers";


dotenv.config();

const registerUser = async(req, res) => {
    // get data
    const {name, email, password} = req.body
    
    // validate
    if((!name || !email || !password)){
        return res.status(400).json({
            message: "all fields are required"
        });
    }
    
    // check if user already exists
    try {
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message: "user already exists"
            })
        }
        
        // create a user in the database
        const user = await User.create({
            name,
            email,
            password,
        })
        console.log(user);

        if(!user){
            return res.status(400).json({
                message: "user not registered",
            })
        }

        // create a verification otp
        const otp = crypto.randomInt(100000, 1000000).toString(); // using crypto here instead of math.floor because it is more secure as math.floor or random internally flow patterns
        console.log(otp);

        // save otp to the database
        user.verificationOtp = otp; 
        user.verificationOtpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mins expirty time

        await user.save()

        // send otp as email to the user
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD
            }
        });

        const mailOptions = {
            from: "test@example.com",
            to: user.email,
            subject: "verify your email",
            text: `the verification otp is : ${otp}`,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                return console.log("error occurred : ", error.message);
            }
            console.log("otp sent successfully : ", info.messageId);
        });

        // send success status to the user
        return res.status(201).json({
            message: "user registered successfully",
            success: true
        });

    } catch (error) {
        return res.status(400).json({
            message: "user not registered",
            error: error.message,
            success: false
        });
    }

};

const verifyUser = async (req, res) => {
    try {
        // get otp from url
        const {otp} = req.body // otps are send in the body and not in the params because otps are sensitive
        // console.log(otp);
    
        // validate otp
        if(!otp){
            return res.status(400).json({
                message: "invalid OTP",
            });
        }
        
        // find user based on otp
        const user = await User.findOne({verificationOtp: otp})
        
        // if not
        if(!user){
            return res.status(400).json({
                message: "invalid OTP",
            });
        }

        // otp expired validation
        if(Date.now() > user.verificationOtpExpiresAt){
            return res.status(400).json({
                message: "the otp has expired",
                success: false
            });
        }
    
        // set is verified field to true
        user.isVerified = true;
    
        // remove verification otp and expiry time
        user.verificationOtp = undefined;
        user.verificationOtpExpiresAt = undefined;
        
        // save
        await user.save();

        // return response
        return res.status(200).json({
            message: "user is verified successfully!!",
            success: true
        });

    } catch (error) {

        return res.status(400).json({
            message: "user verification failed",
            error: error.message,
            success: false,
        });
    }

}

const login = async(req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            message: "all fields are required",
        });
    }

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password) // the password is from the above(line 122) and the second user.password is from the database
        console.log("password match : ", isMatch);

        if(!isMatch){
            return res.status(400).json({
                message: "invalid email or password",
            });
        }

        const token = jwt.sign({id: user._id, role: user.role},
            process.env.JWT_SECRET, {
                expiresIn: '24h'
            }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24*60*60*1000, 
        }
        res.cookie("token", token, cookieOptions); // backend is sending cookies to the browser

        return res.status(200).json({
            success: true,
            message: "login successful",
            token,
            user:{
                id: user._id,
                name: user.name,
                role: user.role,
            }
        });

    } catch (error) {

        return res.status(500).json({
            message: "user was unable to login",
            error: error.message,
            success: false
        });
    }
}

const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // here we are excluding password to go to the frontend cause we want to make sure is stays private

        if(!user){
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: user
        });


    } catch (error) {
        
        return res.status(500).json({
            message: "unable to fetch user details",
            error: error.message,
            success: false
        });
    }
}


const logoutUser = async(req, res) => {
    try {
        
        res.clearCookie("token", {
            httpOnly: true,
            secure: true
        });

        return res.status(200).json({
            success: true,
            message: "logged out successfully"
        });
        console.log("logout successful");

    } catch (error) {
        
        return res.status(500).json({
            message: "unable to logout the user",
            error: error.message,
            success: false
        });
    }
}


const forgotPassword = async(req, res) => {
    // get email
    const {email} = req.body;

    if(!email){
        return res.status(400).json({
            message: "email is required",
            success: false
        });
    }

    try {
        // find user based on email
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "user does not exists",
                success: false
            });
        }        

        
        // reset otp + reset expiry => date.now() + 10*60*1000 => user.save()
        const otp = crypto.randomInt(100000, 1000000).toString();
        console.log(otp);

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpiresAt = Date.now() + 10 * 60 * 1000;

        await user.save();

        // send email => design a url
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD
            }
        });

        const mailOptions = {
            from: "test@example.com",
            to: user.email,
            subject: "password reset",
            text: `the otp for resetting your password is : ${otp}`,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                return console.log("error occurred : ", error.message);
            }
            console.log("password reset otp sent successfully : ", info.messageId);
        });

        return res.status(200).json({
            message: "reset password otp sent successfully",
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            message: "unable to process forgot password request",
            success: false,
            error: error.message
        });
    }
}


const resetPassword = async(req,res) => {

    const {otp, newPassword} = req.body;

    // collect otp and password from req.body
    if(!otp || !newPassword){
        return res.status(400).json({
            message: "all fields are required", 
            success: false
        });
    }

    try {
        // find user
        const user = await User.findOne({resetPasswordOtp : otp});
        if(!user){
            return res.status(400).json({
                message: "invalid otp",
                success: false
            });
        }


        // otp expiry validation 
        if(Date.now() > user.resetPasswordOtpExpiresAt){
            return res.status(400).json({
                message: "the otp is expired",
                success: false
            });
        }
        
        // set password in user
        user.password = newPassword; 
        
        // resettoken, resetexpiry => reset (reset here means to make them empty)
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpiresAt = undefined;

        // save
        await user.save();

        console.log("password reset successful")
        return res.status(200).json({
            message: "password reset successful",
            success: true
        });
            
    }catch (error) {
        
        return res.status(500).json({
            message: "unable to reset the password",
            success: false,
            error: error.message
        });
    }
}


export { registerUser, verifyUser, login, getMe, logoutUser, forgotPassword, resetPassword };

