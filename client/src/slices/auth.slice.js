import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = 'http://localhost:5000/api/auth';

export const sendOtp = createAsyncThunk('auth/sendOtp', async(phone)=>{
    const res = await fetch(`${API_BASE}/send-otp`,{
        method:'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ phone })
    });
    return await res.json();
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async({ phone, otp })=>{
    const res = await fetch(`${API_BASE}/verify-otp`,{
        method:'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ phone, otp })
    });
    const data = await res.json();
    if(data.token){
        localStorage.setItem('token', data.token); 
    }
    return data;
});

export const sendEmailOtp = createAsyncThunk('auth/sendEmailOtp', async(email)=>{
    const res = await fetch(`${API_BASE}/send-email-otp`,{
        method:'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ email })
    });
    return await res.json();
});

export const verifyEmailOtp = createAsyncThunk('auth/verifyEmailOtp', async({ email, otp })=>{
    const res = await fetch(`${API_BASE}/verify-email-otp`,{
        method:'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    // console.log(res )
    if(data.token){
        localStorage.setItem('token', data.token); 
    }
    return data;
});

const authSlice = createSlice({
    name:'auth',
    initialState:{
        phone:'',
        otpSent:false,
        loading: false,
        message:'',
        isLoggedIn:false,
        email:'',
        emailOtpSent:false,
        emailOtpLoading: false,
        emailOtpError: null,
    },
    reducers:{
        setPhone:(state, action) =>{
            state.phone = action.payload;
        },
        setEmail:(state, action) =>{
            state.email = action.payload;
        },
        resetAuth:(state)=>{
            state.phone = '';
            state.otpSent = false;
            state.message = '';
            state.isLoggedIn = false;
            state.email = '';
            state.emailOtpSent = false;
            state.emailOtpError = null;
        }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(sendOtp.pending, (state)=>{
            state.loading = true;
            state.message = '';
        })
        .addCase(sendOtp.fulfilled, (state, action)=>{
            state.loading = false;
            state.message = action.payload.message;
            state.otpSent = action.payload.success;
        })
        .addCase(sendOtp.rejected, (state, action)=>{
            state.loading = false;
            state.message = 'Failed to send OTP';
        })
        .addCase(verifyOtp.pending, (state)=>{
            state.loading = true;
            state.message = '';
        })
        .addCase(verifyOtp.fulfilled, (state, action)=>{
            state.loading = false;
            state.message = action.payload.message || '';
            state.isLoggedIn = action.payload.success;
        })
        .addCase(verifyOtp.rejected, (state, action)=>{
            state.loading = false;
            state.message = 'OTP verification failed';
        })
        .addCase(sendEmailOtp.pending, (state)=>{
            state.emailOtpLoading = true;
            state.emailOtpError = null;
        })
        .addCase(sendEmailOtp.fulfilled, (state, action)=>{
            state.emailOtpLoading = false;
            state.message = action.payload.message;
            state.emailOtpSent = action.payload.success;
        })
        .addCase(sendEmailOtp.rejected, (state, action)=>{
            state.emailOtpLoading = false;
            state.emailOtpError = 'Failed to send OTP';
        })
        .addCase(verifyEmailOtp.pending, (state)=>{
            state.emailOtpLoading = true;
            state.emailOtpError = null;
        })
        .addCase(verifyEmailOtp.fulfilled, (state, action)=>{
            state.emailOtpLoading = false;
            state.message = action.payload.message || '';
            state.isLoggedIn = action.payload.success;
            if(action.payload.token){
                localStorage.setItem('token', action.payload.token);
            }
        })
        .addCase(verifyEmailOtp.rejected, (state, action)=>{
            state.emailOtpLoading = false;
            state.emailOtpError = action.error?.message || 'OTP verification failed';
        })
    }
})

export const { setPhone, setEmail, resetAuth } = authSlice.actions;
export default authSlice.reducer;