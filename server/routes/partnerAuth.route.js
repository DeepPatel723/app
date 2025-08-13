import express,{ Router } from "express";
import { PartnerLoginWithEmailPassword, PartnerProfile, SendPartnerEmailOtpController, SendPartnerEmailOtpSignupController, VerifyPartnerEmailOtpController } from "../controller/partnerAuth.controller.js";

const router = express.Router();

router.post("/signup", SendPartnerEmailOtpSignupController);
router.post("/verify-signup", VerifyPartnerEmailOtpController);
router.post("/login", PartnerLoginWithEmailPassword);
router.post("/login-otp", SendPartnerEmailOtpController);
router.post("/login-otp-verify", VerifyPartnerEmailOtpController);
router.patch("/profile", PartnerProfile);

export default router;
