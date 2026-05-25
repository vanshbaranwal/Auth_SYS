import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { profile } from "console";


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
        
        // create a user in the data base
        const user = await User.create({
            name,
            email,
            password
        })
        console.log(user);

        if(!user){
            return res.status(400).json({
                message: "user not registered"
            })
        }

        // create a verification token
        const token = crypto.randomBytes(32).toString("hex")
        console.log(token);

        // save token to the database
        user.verificationToken = token

        await user.save()

        // send token as email to the user
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "verify your account",
            text: `please click on thee following link: 
            ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
        });

        // send success status to the user
        res.status(201).json({
            message: "user registered successfully",
            success: true
        });

    } catch (error) {
        res.status(400).json({
            message: "user not registered",
            error,
            success: false
        });
    }

};

const verifyUser = async (req, res) => {
    // get token from url
    const {token} = req.params
    console.log(token);

    // validate token
    if(!token){
        return res.status(400).json({
            message: "invalid token",
        });
    }
    
    // find user based on token
    const user = await User.findOne({verificationToken: token})

    // if not
    if(!user){
        return res.status(400).json({
            message: "invalid token",
        });
    }

    // set is verified field to true
    user.isVerified = true;

    // remove verification token
    user.verificationToken = undefined;
    
    // save
    await user.save();

    // return response


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
        console.log(isMatch);

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
        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "login successful",
            token,
            user:{
                id: user._id,
                name: user.name,
                role: user.roll,
            }
        });

    } catch (error) {
        
    }
}

const getMe = async(req, res) => {
    try {
        console.log("reached at the profile level");
    } catch (error) {
        
    }
}


const logoutUser = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}


const forgotPassword = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}


const resetPassword = async(req,res) => {
    try {
        
    } catch (error) {
        
    }
}


export { registerUser, verifyUser, login, logoutUser, forgotPassword, resetPassword, getMe };


// pending routes 
// user profile
// logout
// forgotpassword
// resetpassword