import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// creating tranport
const sendVerificationEmail = async (email, token) => {
    try {
        // create email transpoter 

        const transpoter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,      
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }

        })

        // email content
        const mailOptions = {

            from: `"AskUni!" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email address – Your OTP code",
            text: [
                "Thank you for registering! Please verify your email address to complete your registration.",
                "",
                `Your verification code (OTP) is: ${token}`,
                "",
                "This code will expire in 10 minutes.",
                "If you did not create an account, please ignore this email."
            ].join('\n'),
            html: `
                <p>Thank you for signing up with AskUni! Please verify your email address to complete your registration.</p>
                <h2 style="color: rgb(67, 217, 192);">Your verification code (OTP): <b>${token}</b></h2>
                <p>This code will expire in 10 minutes.<br>If you did not create an account, please ignore this email.</p>
            `

        };


        // send mail

        const info = await transpoter.sendMail(mailOptions);
        return true;

    } catch (error) {

        console.log("error sending the verification email to the user.");
        return false;
    
    }
}


export default sendVerificationEmail;