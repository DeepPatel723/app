import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE = 'http://localhost:5000/api/partner-auth';

export const sendEmailOtp = createAsyncThunk(
    "partner-auth/sendEmailOtp",
    async (email) => {
        const res = await fetch(`${API_BASE}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });
        return res.json();
    }
);

export const verifyEmailOtp = createAsyncThunk(
    "partner-auth/verifyEmailOtp",
    async ({ email, otp }) => {
        const res = await fetch(`${API_BASE}/verify-signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp }),
        });
        return res.json();
    }
);

export const sendEmailOtpLogin = createAsyncThunk(
    "partner-auth/sendEmailOtpLogin",
    async (email) => {
        const res = await fetch(`${API_BASE}/login-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });
        return res.json();
    }
);

export const verifyEmailOtpLogin = createAsyncThunk(
    "partner-auth/verifyEmailOtpLogin",
    async ({ email, otp }) => {
        const res = await fetch(`${API_BASE}/verify-login-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp }),
        });
        return res.json();
    }
);

export const sendEmailPasswordLogin = createAsyncThunk(
    "partner-auth/sendEmailPasswordLogin",
    async (email, password) => {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    }
);

const partnerAuthSlice = createSlice({
    name: "partnerAuth",
    initialState: {
        email: "",
        password:"",
        emailOtpSent: false,
        emailOtpLoading: false,
        isLoggedIn: false,
        emailOtpError: null,
        message: "",
    },
    reducers: {
        setEmail(state, action) {
            state.email = action.payload;
        },
        setPassword(state, action) {
            state.password = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendEmailOtp.pending, (state) => {
                state.emailOtpLoading = true;
            })
            .addCase(sendEmailOtp.fulfilled, (state, action) => {
                state.emailOtpLoading = false;
                state.emailOtpSent = true;
                state.message = action.payload.message;
            })
            .addCase(sendEmailOtp.rejected, (state, action) => {
                state.emailOtpLoading = false;
                state.message = action.error.message;
            })
            .addCase(sendEmailOtpLogin.pending, (state) => {
                state.emailOtpLoading = true;
            })
            .addCase(sendEmailOtpLogin.fulfilled, (state, action) => {
                state.emailOtpLoading = false;
                state.emailOtpSent = true;
                state.message = action.payload.message;
            })
            .addCase(sendEmailOtpLogin.rejected, (state, action) => {
                state.emailOtpLoading = false;
                state.message = action.error.message;
            })
            .addCase(verifyEmailOtp.pending, (state) => {
                state.emailOtpLoading = true;
                state.emailOtpError = null;
            })
            .addCase(verifyEmailOtp.fulfilled, (state, action) => {
                state.emailOtpLoading = false;
                state.message = action.payload.message || '';
                state.isLoggedIn = action.payload.success;
                if (action.payload.token) {
                    localStorage.setItem('token', action.payload.token);
                }
            })
            .addCase(verifyEmailOtp.rejected, (state, action) => {
                state.emailOtpLoading = false;
                state.emailOtpError = action.error?.message || 'OTP verification failed';
            })
            .addCase(verifyEmailOtpLogin.pending, (state) => {
                state.emailOtpLoading = true;
                state.emailOtpError = null;
            })
            .addCase(verifyEmailOtpLogin.fulfilled, (state, action) => {
                state.emailOtpLoading = false;
                state.message = action.payload.message || '';
                state.isLoggedIn = action.payload.success;
                if (action.payload.token) {
                    localStorage.setItem('token', action.payload.token);
                }
            })
            .addCase(verifyEmailOtpLogin.rejected, (state, action) => {
                state.emailOtpLoading = false;
                state.emailOtpError = action.error?.message || 'OTP verification failed';
            })
            .addCase(sendEmailPasswordLogin.pending, (state) => {
                state.emailOtpLoading = true;
                state.emailOtpError = null;
            })
            .addCase(sendEmailPasswordLogin.fulfilled, (state, action) => {
                state.emailOtpLoading = false;
                state.message = action.payload.message || '';
                state.isLoggedIn = action.payload.success;
                if (action.payload.token) {
                    localStorage.setItem('token', action.payload.token);
                }
            })
            .addCase(sendEmailPasswordLogin.rejected, (state, action) => {
                state.emailOtpLoading = false;
                state.emailOtpError = action.error?.message || 'Login failed';
            })

    },
});

export const { setEmail, setPassword } = partnerAuthSlice.actions;

export default partnerAuthSlice.reducer;