import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendEmailOtp, setEmail, verifyEmailOtp } from '../../slices/partner.slice';
import { useNavigate } from 'react-router-dom';

const PartnerRegister = () => {
    const [step, setStep] = useState('main');
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { email, emailOtpSent, emailOtpLoading, isLoggedIn, isProfileComplete, message } = useSelector((state) => state.partnerAuth);

    const handleEmailOtpSend = () => {
        if (email && email.includes('@')) {
            dispatch(sendEmailOtp(email));
            setStep('email-otp');
        } else {
            alert('Enter a valid email address');
        }
    };

    const handleEmailOtpVerify = () => {
        if (otp.length === 6) {
            dispatch(verifyEmailOtp({ email, otp }))
                .then((res) => {
                    const ok = res.payload?.success;
                    console.log(ok);
                    const complete = res.payload?.isProfileComplete;
                    console.log(complete);

                    if (ok && !complete) {
                        navigate("/partner/complete-profile");
                    }
                });
        } else {
            alert('Enter the OTP');
        }
    };

    return (
        <div className="partner-right-sec">
            <h2>Register as Partner</h2>
            <div className="partner-auth-sec">
                <div className="partner-input-field">
                    <label>Email</label>
                    <input type="email" placeholder="Email" value={email || ''} onChange={(e) => dispatch(setEmail(e.target.value))}
                        className='input-field' />
                    <button
                        className="button-email-otp-sent"
                        onClick={handleEmailOtpSend}
                        disabled={emailOtpLoading}
                    >
                        {emailOtpLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                </div>

                {step === 'email-otp' && (
                    <div className="partner-input-field">
                        <label>Enter Otp</label>
                        <input type="text" placeholder="Enter Otp" value={otp} onChange={(e) => setOtp(e.target.value)}
                            className='input-field' />
                        <button
                            className="button-email-otp-verify"
                            onClick={handleEmailOtpVerify}
                            disabled={emailOtpLoading}
                        >
                            {emailOtpLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                )}
            </div>
            {message && <p className="text-sm mt-4 text-gray-500">{message}</p>}
            {isLoggedIn && <p className="text-green-600 mt-4">🎉 Logged in successfully!</p>}
        </div>
    )
}

export default PartnerRegister;