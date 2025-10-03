import User from '../models/user.models.js';
import crypto from 'crypto';

// register controller
const register = async (req, res) => {
    res.send("hello user is registered.");

    // getting user data from req body 
    
    const {name, email, password} = req.body;

    // validate data 
    
    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message: "all fields are required."
        })
    }

    // password check
    
    if(password.length < 4){
        return res.status().json({
            success: false,
            message: "password is not valid (the length of the password should be greater than 4)."
        })
    }

    // check for existing user

    try {
        const existingUser = await User.findOne({
            email
        })

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "the user already exists."
            })
        }

        // user verification token
        
        const token = crypto.randomInt(100000, 999999); // this will generate a 6 digit random number
        const tokenExpiry = new Date.now() + 10 * 60 * 1000; // the expire time is of 10 mins


        // create new user

        const user = await User.create({
            name,
            email,
            password,
            verificationToken: token,
            verificationTokenExpiry: tokenExpiry
        })

        // check user created or not

        if(!user){
            res.status(400).json({
                success: false,
                message: "user not created."
            })
        }

        // send mail

    
    } catch (error) {
        
    }
}







export { register };