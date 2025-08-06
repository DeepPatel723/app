import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { sendEmailOtp, sendOtp, setPhone, verifyEmailOtp, verifyOtp, setEmail } from '../slices/auth.slice';

const AuthActions = () => {
  const [step, setStep] = useState('menu');
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const { phone, loading, otpSend, isLoggedIn, message, email, emailOtpLoading, emailOtpSent } = useSelector(state => state.auth);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleEmailLogin = () => {
    setStep('email');
  };

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
      dispatch(verifyEmailOtp({email, otp}));
    } else {
      alert('Enter 6-digit OTP')
    }
  };

  const handleAppleLogin = () => {
    alert('Apple login logic will go here');
  };

  const handleOtpSend = () => {
    if (phone.length === 10) {
      dispatch(sendOtp(phone));
      setStep('phone');
    } else {
      alert('Enter a valid 10-digit phone number')
    }
  };

  const handleOtpVerify = () => {
    if (otp.length === 6) {
      dispatch(verifyOtp({phone, otp}));
    } else {
      alert('Enter 6-digit OTP')
    }
  };

  return (
    <div className='main-container'>
      <button className='button button-google-login' onClick={handleGoogleLogin}>
        Countinue With Google
      </button>
      <button className='button button-google-login' onClick={handleEmailLogin}>
        Countinue With Email
      </button>
      <button className='button button-google-login' onClick={handleAppleLogin}>
        Countinue With Apple
      </button>
      <div>or</div>
      <div className='phone-login'>
        <input type='tel' placeholder='Enter Your Number' value={phone} onChange={(e) => dispatch(setPhone(e.target.value))} className='mobile-imput' />
        <button className='button-otp-sent' onClick={handleOtpSend} disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
      </div>



or


      {step === 'email' && (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email || ''}
            onChange={e => dispatch(setEmail(e.target.value))}
            className="email-input-field"
          />
          <button
            className="button-email-otp-sent"
            onClick={handleEmailOtpSend}
            disabled={emailOtpLoading}
          >
            {emailOtpLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      )}

      {step === 'email-otp' && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="otp-input-field"
          />
          <button
            className="button-verify-otp"
            onClick={handleEmailOtpVerify}
            disabled={emailOtpLoading}
          >
            {emailOtpLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}


      {step === 'phone' && otpSend && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="otp-input-field"
          />
          <button
            className="button-verify-otp"
            onClick={handleOtpVerify}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}

      {message && <p className="text-sm mt-4 text-gray-500">{message}</p>}

      {isLoggedIn && <p className="text-green-600 mt-4">🎉 Logged in successfully!</p>}
    </div>
  )
}

export default AuthActions;
