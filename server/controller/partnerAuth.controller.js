import jwt from "jsonwebtoken";
import PartnerUser from "../models/partnerUser.js";
import { sendEmailOtp } from "../utils/sendEmailOtp.util.js";
import bcrypt from "bcryptjs";

const partnerEmailOtps = new Map();

const generatedPartnerToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

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
        return res.status(200).json({
            success: true, token, isProfileComplete: partner.isProfileComplete,
            message: "Login successful",
        });
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
        const expiresAt = Date.now() + 5 * 60 * 1000;
        partnerEmailOtps.set(email, { otp, expiresAt });

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

        if (partner) {
            return res.status(404).json({ success: false, message: "Partner already exists!" });
        }
        // if (!partner) {
        //     return res.status(404).json({ success: false, message: "Partner not found!" });
        // }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = Date.now() + 5 * 60 * 1000;
        partnerEmailOtps.set(email, { otp, expiresAt });

        // Send OTP email (implementation depends on your email service)
        await sendEmailOtp(email, otp);

        return res.status(200).json({ success: true,isProfileComplete: false, message: "OTP sent to email!" });
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
            partner = await PartnerUser.create({ email, isVerified: true, Orgname: email.split('@')[0] });
        }

        partnerEmailOtps.delete(email);
        return res.status(200).json({ success: true, message: "OTP verified successfully!", token: generatedPartnerToken(partner._id),isProfileComplete: false });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const PartnerProfile = async (req, res) => {
    try {
        const auth = req.headers.authorization || "";
        console.log(auth)
        const raw = auth.startsWith("Bearer ") ? auth.slice(7) : null;
        console.log(raw)
        if (!raw || raw === "null") {
            return res.status(401).json({ success: false, message: "No Token" });
        }

        const decoded = jwt.verify(raw, process.env.JWT_SECRET);
        console.log(decoded)
        if (!decoded) {
            return res.status(403).json({ success: false, message: "Invalid Token" });
        }

        const { phone, password, Orgname } = req.body;
        if (!phone || String(phone).length !== 10)
            return res.status(400).json({ success: false, message: "Valid 10-digit phone required" });
        if (!password || password.length < 6)
            return res.status(400).json({ success: false, message: "Password min 6 chars" });

        const partner = await PartnerUser.findById(decoded.id);
        if (!partner) {
            return res.status(404).json({ success: false, message: "Partner not found!" });
        }

        partner.phone = String(phone);
        partner.password = await bcrypt.hash(password, 10);
        partner.Orgname = Orgname;
        partner.isProfileComplete = true;

        await partner.save();
        return res.status(200).json({ success: true, message: "Profile updated successfully!",isProfileComplete: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}