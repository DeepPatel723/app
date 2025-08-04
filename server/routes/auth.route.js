import express, { Router } from "express";
import { LoginWithEmail, SendEmailOtpController, sendPhoneOtp, VerifyEmailOtpController, verifyPhoneOtp } from "../controller/auth.controller.js";
import { sendEmailOtp } from "../utils/sendEmailOtp.util.js";
import passport from "passport";
import jwt from "jsonwebtoken";     

const router = express.Router();

router.post('/email', LoginWithEmail );
router.post('/send-email-otp', SendEmailOtpController );
router.post('/verify-email-otp', VerifyEmailOtpController );
 
router.post('/send-otp', sendPhoneOtp );
router.post('/verify-otp', verifyPhoneOtp );

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.redirect(`http://localhost:3000/?token=${token}`);
    }
);  

export default router;