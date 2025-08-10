import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { sendEmailOtp, sendOtp, setPhone, verifyEmailOtp, verifyOtp, setEmail } from '../slices/auth.slice';

const AuthActions = ({ onClose }) => {
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
      dispatch(verifyEmailOtp({ email, otp }));
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
      dispatch(verifyOtp({ phone, otp }));
    } else {
      alert('Enter 6-digit OTP')
    }
  };

  return (
    <div id="auth-actions-popup" className='main-container-login-popup'>
      <div className="login-popup-wrapper">
        {step === 'menu' && (
          <div className="popup-sec">
            <div className="popup-header">
              <h2 className="popup-title">Get Started</h2>
              <div className="popup-close svg-wrapper" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
            </div>
            <div className="popup-content">
              <div className="buttons-contianer">
                <div className="button-action">
                  <button className='button button-google-login' onClick={handleGoogleLogin}>
                    <span className="button-icon svg-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      </svg>
                    </span>
                    Continue With Google
                  </button>
                </div>
                <div className="button-action">
                  <button className='button button-email-login' onClick={handleEmailLogin}>
                    <span className="button-icon svg-wrapper">
                      <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z" fill="#080341" />
                      </svg>
                    </span>
                    Continue With Email
                  </button>
                </div>
                <div className="extra-name-label">
                  <div className="extra-label">OR</div>
                </div>
                <div className="phone-number-sec">
                  <div className="phone-number-wrapper">
                    <div className='phone-login'>
                      <input type='tel' placeholder='Enter Your Number' value={phone} onChange={(e) => dispatch(setPhone(e.target.value))} className='mobile-imput' />
                      <button className='button-otp-sent' onClick={handleOtpSend} disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {step === 'email' && (
        <div className="popup-sec">
          <div className="popup-header">
            <div className="popup-close svg-wrapper" onClick={() => setStep('menu')}>
              <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                width="800px" height="800px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
                <g>
                  <path d="M33.934,54.458l30.822,27.938c0.383,0.348,0.864,0.519,1.344,0.519c0.545,0,1.087-0.222,1.482-0.657
		c0.741-0.818,0.68-2.083-0.139-2.824L37.801,52.564L64.67,22.921c0.742-0.818,0.68-2.083-0.139-2.824
		c-0.817-0.742-2.082-0.679-2.824,0.139L33.768,51.059c-0.439,0.485-0.59,1.126-0.475,1.723
		C33.234,53.39,33.446,54.017,33.934,54.458z"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="popup-content">
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
        </div>
      )}

      {step === 'email-otp' && (
        <div className="popup-sec">
          <div className="popup-header">
            <div className="popup-close svg-wrapper" onClick={() => setStep('email')}>
              <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                width="800px" height="800px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
                <g>
                  <path d="M33.934,54.458l30.822,27.938c0.383,0.348,0.864,0.519,1.344,0.519c0.545,0,1.087-0.222,1.482-0.657
		c0.741-0.818,0.68-2.083-0.139-2.824L37.801,52.564L64.67,22.921c0.742-0.818,0.68-2.083-0.139-2.824
		c-0.817-0.742-2.082-0.679-2.824,0.139L33.768,51.059c-0.439,0.485-0.59,1.126-0.475,1.723
		C33.234,53.39,33.446,54.017,33.934,54.458z"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="popup-content">
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
        </div>
      )}


      {step === 'phone' && otpSend && (
        <div className='popup-sec'>
          <div className="popup-header">
            <div className="popup-close svg-wrapper" onClick={() => setStep('email')}>
              <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                width="800px" height="800px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
                <g>
                  <path d="M33.934,54.458l30.822,27.938c0.383,0.348,0.864,0.519,1.344,0.519c0.545,0,1.087-0.222,1.482-0.657
		c0.741-0.818,0.68-2.083-0.139-2.824L37.801,52.564L64.67,22.921c0.742-0.818,0.68-2.083-0.139-2.824
		c-0.817-0.742-2.082-0.679-2.824,0.139L33.768,51.059c-0.439,0.485-0.59,1.126-0.475,1.723
		C33.234,53.39,33.446,54.017,33.934,54.458z"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="popup-content">
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
        </div>
      )}

      {message && <p className="text-sm mt-4 text-gray-500">{message}</p>}

      {isLoggedIn && <p className="text-green-600 mt-4">🎉 Logged in successfully!</p>}
    </div>
  )
}

export default AuthActions;
