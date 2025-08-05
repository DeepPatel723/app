import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendtwilioOtp = async (phone, otp) => {
    return await client.messages.create({
        body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE,
        to: `+91${phone}`
    })
};