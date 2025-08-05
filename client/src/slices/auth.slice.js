import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = 'http://localhost:5000';

export const sendOtp = createAsyncThunk('auth/sendOtp', async(phone)=>{
    const res = await fetch(`${API_BASE}/sendOtp`,{
        method:'POST',
        headers: { 'content-type':'appliction/json' },
        body: JSON.stringify({ phone })
    });
    return await res.json();
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async(phone)=>{
    const res = await fetch(`${API_BASE}/verifyOtp`,{
        method:'POST',
        headers: { 'content-type':'appliction/json' },
        body: JSON.stringify({ phone })
    });
    const data = await res.json();
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
        isLoggedIn:false
    },
    reducers:{
        setPhone:(state, action) =>{
            state.phone = action.payload;
        },
        resetAuth:(state)=>{
            state.phone = '';
            state.otpSent = false;
            state.message = '';
            state.isLoggedIn = false;
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
            state.sendOtp = action.payload.success;
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
            state.sendOtp = action.payload.success;
        })
        .addCase(verifyOtp.rejected, (state, action)=>{
            state.loading = false;
            state.message = 'OTP verification failed';
        })
    }
})

export const { setPhone, resetAuth } = authSlice.actions;
export default authSlice.reducer;