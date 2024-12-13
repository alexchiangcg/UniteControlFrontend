import { configureStore } from "@reduxjs/toolkit";
import registerApi from '../services/registerServices';

export const store = configureStore({
    reducer: {
        [registerApi.reducerPath]: registerApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(registerApi.middleware),
});

export default store;