import User from '../models/user.models.js';
import crypto from 'crypto';
import sendVerificationEmail from '../utils/sendMail.js'

// register controller
const register = async (req, res) => {

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
        return res.status(400).json({
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
        const tokenExpiry = Date.now() + 10 * 60 * 1000; // the expire time is of 10 mins


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

        await sendVerificationEmail(user.email, token);
        console.log("verification mail sent successfully");

        // response to user

        return res.status(200).json({
            success: true,
            message: "user registered successfully!, now you'll have to verify your email"
        });
    

    } catch (error) {
        console.error("here is the error in register catch", error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: error.message
        });

    }
}


// verify controller
const verify = async(req, res) => {

    try {
        
        // get token from params (url)

        const token = req.params.token

        // get user

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: {$gt: Date.now()} // gt here means greaterthan which says that if the date.now is greater than the time when the message was send.
        })

        // is user existing

        if(!user){
            res.status(400).json({
                success: false,
                message: "the token is invalid or expired."
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;


        await user.save();

        return res.status(200).json({
            success: true,
            message: "user account is verified"
        })


    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });

    }
}


// login controller

// const login = async(req, res) => {

// }






export { register, verify };