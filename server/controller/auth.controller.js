import bycrpt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { sendEmailOtp } from "../utils/sendEmailOtp.util.js";
import { sendtwilioOtp } from "../utils/sendPhoneOtp.util.js";
import { phoneOtpStore } from "../utils/otpStore.js";

const emailOtps = new Map();
// const otpStore = new Map();

const generatedToken = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:'7d'});

export const LoginWithEmail = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        console.log('user:', user);
// console.log('comparePassword available:', typeof user.comparePassword);

        if (!user) {
            user = await User.create({ email, password });
        } else {
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message:"Incorrect Password!!"
                })
            }
            res.json({
                token: generatedToken(user._id)
            })
        }

    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
}

export const SendEmailOtpController = async (req, res) => {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 *60 * 1000;

    emailOtps.set(email, { otp, expiresAt});

    try {
        await sendEmailOtp(email, otp);
        return res.status(200).json({
            success: true,
            message:'OTP sent to Email',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const VerifyEmailOtpController = async (req, res) => {
    const { email, otp } = req.body;

    const record = emailOtps.get(email);
// console.log("emailOtps keys:", [...emailOtps.keys()]);
// console.log("Requested email:", email);
// console.log("Stored record:", emailOtps.get(email));
    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
        return res.status(400).json({
            success: false,
            message:'Invalid or Expried OTP!!'
        });
    }

    let user = await User.findOne({email});

    if (!user) {
        user = await User.create({
        email,
        name: email.split('@')[0].replace(/\./g, ' ').replace(/_/g, ' ').replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase()),
        });
    }

    emailOtps.delete(email);

    return res.status(200).json({
        success: true,
        token: generatedToken(user._id),
    })
};

export const sendPhoneOtp  = async (req, res) => {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
    return res.status(400).json({ success: false, message: 'Invalid phone number' });
}

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 *60 * 1000;

    phoneOtpStore.set(phone, { otp, expiresAt});

    try {
        await sendtwilioOtp(phone, otp);
        return res.status(200).json({
            success: true,
            message:'OTP sent successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyPhoneOtp  = async (req, res) => {
    const { phone, otp } = req.body;

    const record = phoneOtpStore.get(phone);

    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
        return res.status(400).json({
            success: false,
            message:'Invalid or Expried OTP!!'
        });
    }

    let user = await User.findOne({phone});

    if (!user) {
        user = await User.create({
        phone,
        name: `User-${phone}`,
        email: 'email@gmail.com',
        password: 'otp_user_dummy_password',
        });
    }

    phoneOtpStore.delete(phone);

    return res.status(200).json({
        success: true,
        token: generatedToken(user._id),
    })
};