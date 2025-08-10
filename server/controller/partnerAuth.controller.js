import jwt from "jsonwebtoken";
import PartnerUser from "../models/partnerUser.js";
import { sendEmailOtp } from "../utils/sendEmailOtp.util.js";

const partnerEmailOtps = new Map();

const generatedPartnerToken = (id) => jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '7d' });

export const PartnerLoginWithEmailPassword = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required!" });
    }

    try {
        const partner = await PartnerUser.findOne({ email });
        if (!partner) {
            return res.status(401).json({ success: false, message: "Invalid email or password!" });
        }

        const isMatch = await partner.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password!" });
        }

        const token = generatedPartnerToken(partner._id);
        return res.status(200).json({ success: true, token });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const SendPartnerEmailOtpController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required!" });
    }

    try {
        const partner = await PartnerUser.findOne({ email });
        // if (!partner) {
        //     return res.status(404).json({ success: false, message: "Partner not found!" });
        // }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = Date.now() + 5 *60 * 1000;
        partnerEmailOtps.set(email, {otp, expiresAt});

        // Send OTP email (implementation depends on your email service)
        await sendEmailOtp(email, otp);

        return res.status(200).json({ success: true, message: "OTP sent to email!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const SendPartnerEmailOtpSignupController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required!" });
    }

    try {
        const partner = await PartnerUser.findOne({ email });

        if (partner){
            return res.status(404).json({ success: false, message: "Partner already exists!" });
        }
        // if (!partner) {
        //     return res.status(404).json({ success: false, message: "Partner not found!" });
        // }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = Date.now() + 5 *60 * 1000;
        partnerEmailOtps.set(email, {otp, expiresAt});

        // Send OTP email (implementation depends on your email service)
        await sendEmailOtp(email, otp);

        return res.status(200).json({ success: true, message: "OTP sent to email!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const VerifyPartnerEmailOtpController = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required!" });
    }

    try {
        const storedOtp = partnerEmailOtps.get(email);
        // console.log(storedOtp.otp);
        // console.log(otp)
        // console.log(storedOtp.otp !== otp)
        // console.log(Date.now() > storedOtp.expiresAt)
        // console.log(!storedOtp)
        if (!storedOtp || Date.now() > storedOtp.expiresAt || storedOtp.otp.toString() !== otp) {
            return res.status(400).json({ success: false, message: "OTP not sent or expired!" });
        }

        let partner = await PartnerUser.findOne({ email });

        if (!partner) {
            partner= await PartnerUser.create({ email, Orgname: email.split('@')[0] });
        }
        partnerEmailOtps.delete(email);
        return res.status(200).json({ success: true, message: "OTP verified successfully!", token: generatedPartnerToken(partner._id) });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};