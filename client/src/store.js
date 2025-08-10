import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/auth.slice.js';
import partnerAuthReducer from './slices/partner.slice.js';

export const store = configureStore({
    reducer:{
        auth: authReducer,
        partnerAuth: partnerAuthReducer
    }
});